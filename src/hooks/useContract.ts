import { ethers } from "ethers";
import { CONTRACT_ABI } from "@/lib/contract";

const CONTRACT_ADDRESS = "0x61e56d103678d0e0e75c86f90Bb9FdF0c5CD65f3";
const ABI = CONTRACT_ABI;

const getEthereumProvider = () => {
  const ethereum = (window as Window & { ethereum?: unknown }).ethereum;
  if (!ethereum) {
    throw new Error("MetaMask not detected. Please install MetaMask.");
  }
  return ethereum;
};

export const getContract = async () => {
  const provider = new ethers.BrowserProvider(getEthereumProvider());
  const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
  return contract;
};

export const getSignerContract = async () => {
  const provider = new ethers.BrowserProvider(getEthereumProvider());
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
  return contract;
};

export { CONTRACT_ADDRESS };
