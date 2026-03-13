import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Wallet, Leaf, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWeb3 } from "@/contexts/Web3Context";
import { motion, AnimatePresence } from "framer-motion";

const links = [
  { to: "/", label: "Home" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/tracker", label: "Tracker" },
  { to: "/qr", label: "QR Code" },
  { to: "/verify", label: "Verify" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { account, balance, isConnecting, connectWallet, disconnectWallet } = useWeb3();
  const location = useLocation();

  const truncate = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 font-heading font-bold text-xl">
            <Leaf className="h-6 w-6 text-secondary" />
            <span className="text-primary">Organic</span>
            <span className="text-secondary">Chain</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === l.to
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* Wallet Button */}
          <div className="hidden md:flex items-center gap-3">
            {account ? (
              <div className="flex items-center gap-2">
                <div className="glass rounded-full px-4 py-2 text-sm font-mono flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                  {truncate(account)}
                  <span className="text-muted-foreground">|</span>
                  <span className="text-secondary font-medium">{parseFloat(balance || "0").toFixed(4)} ETH</span>
                </div>
                <Button variant="ghost" size="icon" onClick={disconnectWallet}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button onClick={connectWallet} disabled={isConnecting} className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
                <Wallet className="h-4 w-4" />
                {isConnecting ? "Connecting..." : "Connect Wallet"}
              </Button>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden p-2" onClick={() => setOpen(!open)}>
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-border/50 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-2">
              {links.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className={`block px-3 py-2 rounded-md text-sm font-medium ${
                    location.pathname === l.to ? "bg-primary/10 text-primary" : "text-muted-foreground"
                  }`}
                >
                  {l.label}
                </Link>
              ))}
              <div className="pt-2 border-t border-border">
                {account ? (
                  <div className="space-y-2">
                    <p className="text-xs font-mono text-muted-foreground">{truncate(account)}</p>
                    <p className="text-xs text-secondary">{parseFloat(balance || "0").toFixed(4)} ETH</p>
                    <Button variant="outline" size="sm" onClick={disconnectWallet} className="w-full">Disconnect</Button>
                  </div>
                ) : (
                  <Button onClick={connectWallet} disabled={isConnecting} className="w-full bg-primary text-primary-foreground">
                    <Wallet className="h-4 w-4 mr-2" />
                    {isConnecting ? "Connecting..." : "Connect Wallet"}
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
