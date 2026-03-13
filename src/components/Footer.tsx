import { Leaf } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 font-heading font-bold text-lg mb-3">
              <Leaf className="h-5 w-5 text-secondary" />
              <span className="text-primary">Organic</span><span className="text-secondary">Chain</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-sm">
              Blockchain-powered traceability platform ensuring transparency and trust for organic produce from farm to table.
            </p>
          </div>
          <div>
            <h4 className="font-heading font-semibold text-sm mb-3">Platform</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <Link to="/dashboard" className="block hover:text-foreground transition-colors">Dashboard</Link>
              <Link to="/tracker" className="block hover:text-foreground transition-colors">Tracker</Link>
              <Link to="/qr" className="block hover:text-foreground transition-colors">QR Code</Link>
              <Link to="/verify" className="block hover:text-foreground transition-colors">Verify</Link>
            </div>
          </div>
          <div>
            <h4 className="font-heading font-semibold text-sm mb-3">Network</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Ethereum Sepolia</p>
              <p>Chain ID: 11155111</p>
              <a href="https://sepolia.etherscan.io" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors block">Etherscan ↗</a>
            </div>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-border text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} OrganicChain. All rights reserved. Powered by Ethereum.
        </div>
      </div>
    </footer>
  );
}
