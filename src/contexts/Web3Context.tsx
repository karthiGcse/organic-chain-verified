import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import { BrowserProvider, Contract, formatEther, JsonRpcProvider } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI, SEPOLIA_CHAIN_ID, SEPOLIA_RPC, SEPOLIA_RPC_BACKUP } from "@/lib/contract";
import { toast } from "sonner";

async function createReadProvider(): Promise<JsonRpcProvider> {
  const primary = new JsonRpcProvider(SEPOLIA_RPC);
  try {
    await primary.getBlockNumber();
    return primary;
  } catch {
    console.warn("Primary RPC failed, trying backup...");
    const backup = new JsonRpcProvider(SEPOLIA_RPC_BACKUP);
    try {
      await backup.getBlockNumber();
      return backup;
    } catch {
      console.warn("Backup RPC also failed, returning primary as fallback");
      return primary;
    }
  }
}

interface Web3State {
  account: string | null;
  balance: string | null;
  isConnecting: boolean;
  contract: Contract | null;
  readContract: Contract | null;
  provider: BrowserProvider | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
}

const Web3Context = createContext<Web3State>({} as Web3State);
export const useWeb3 = () => useContext(Web3Context);

export function Web3Provider({ children }: { children: React.ReactNode }) {
  const [account, setAccount] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [contract, setContract] = useState<Contract | null>(null);
  const [readContract, setReadContract] = useState<Contract | null>(null);
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const initRef = useRef(false);

  // Initialize read-only provider with fallback
  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;
    createReadProvider().then((rp) => {
      setReadContract(new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, rp));
    }).catch(console.error);
  }, []);

  const connectWallet = useCallback(async () => {
    if (!(window as any).ethereum) {
      toast.error("MetaMask not detected. Please install MetaMask.");
      return;
    }
    setIsConnecting(true);
    try {
      const ethereum = (window as any).ethereum;
      await ethereum.request({ method: "eth_requestAccounts" });

      const chainId = await ethereum.request({ method: "eth_chainId" });
      if (parseInt(chainId, 16) !== SEPOLIA_CHAIN_ID) {
        try {
          await ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: "0x" + SEPOLIA_CHAIN_ID.toString(16) }],
          });
        } catch {
          toast.error("Please switch to Sepolia testnet in MetaMask.");
          setIsConnecting(false);
          return;
        }
      }

      const browserProvider = new BrowserProvider(ethereum);
      const signer = await browserProvider.getSigner();
      const address = await signer.getAddress();
      const bal = await browserProvider.getBalance(address);

      setProvider(browserProvider);
      setAccount(address);
      setBalance(formatEther(bal));
      setContract(new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer));
      toast.success("Wallet connected!");
    } catch (err: any) {
      toast.error(err?.message || "Failed to connect wallet");
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnectWallet = useCallback(() => {
    setAccount(null);
    setBalance(null);
    setContract(null);
    setProvider(null);
    toast.info("Wallet disconnected");
  }, []);

  useEffect(() => {
    const ethereum = (window as any).ethereum;
    if (!ethereum) return;
    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) disconnectWallet();
      else connectWallet();
    };
    const handleChainChanged = () => window.location.reload();
    ethereum.on("accountsChanged", handleAccountsChanged);
    ethereum.on("chainChanged", handleChainChanged);
    return () => {
      ethereum.removeListener("accountsChanged", handleAccountsChanged);
      ethereum.removeListener("chainChanged", handleChainChanged);
    };
  }, [connectWallet, disconnectWallet]);

  return (
    <Web3Context.Provider value={{ account, balance, isConnecting, contract, readContract, provider, connectWallet, disconnectWallet }}>
      {children}
    </Web3Context.Provider>
  );
}
