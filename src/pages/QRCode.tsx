import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { QrCode, Download, Printer, Loader2, ExternalLink } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useWeb3 } from "@/contexts/Web3Context";
import { ETHERSCAN_BASE } from "@/lib/contract";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";

export default function QRCodePage() {
  const { contract } = useWeb3();
  const [productId, setProductId] = useState("");
  const [generated, setGenerated] = useState(false);
  const [loading, setLoading] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  const verifyUrl = `${window.location.origin}/verify/${productId}`;

  const handleGenerate = async () => {
    if (!productId.trim()) { toast.error("Enter a Product ID"); return; }
    if (!contract) { toast.error("Connect wallet first"); return; }
    setLoading(true);
    try {
      const tx = await contract.generateQR(productId);
      toast.info("Transaction submitted...");
      const receipt = await tx.wait();
      setGenerated(true);
      toast.success(
        <div className="space-y-1">
          <p>QR Code generated on blockchain!</p>
          <a href={`${ETHERSCAN_BASE}/tx/${receipt.hash}`} target="_blank" rel="noopener noreferrer" className="text-xs underline flex items-center gap-1">
            Etherscan <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      );
    } catch (err: any) {
      toast.error(err?.reason || err?.message || "Failed");
    } finally { setLoading(false); }
  };

  const handleDownload = () => {
    const svg = qrRef.current?.querySelector("svg");
    if (!svg) return;
    const data = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    canvas.width = 512; canvas.height = 512;
    const ctx = canvas.getContext("2d")!;
    const img = new Image();
    img.onload = () => {
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, 512, 512);
      ctx.drawImage(img, 0, 0, 512, 512);
      const a = document.createElement("a");
      a.download = `organicchain-${productId}.png`;
      a.href = canvas.toDataURL("image/png");
      a.click();
    };
    img.src = "data:image/svg+xml;base64," + btoa(data);
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    const svg = qrRef.current?.querySelector("svg");
    if (!svg) return;
    const data = new XMLSerializer().serializeToString(svg);
    printWindow.document.write(`
      <html><head><title>OrganicChain QR - ${productId}</title>
      <style>body{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;font-family:sans-serif;margin:0;}
      h2{margin:0 0 8px;}p{margin:0;color:#666;font-size:14px;}</style></head>
      <body><h2>OrganicChain</h2><p>Product: ${productId}</p><div style="margin:20px 0">${data}</div>
      <p style="font-size:12px">${verifyUrl}</p>
      <script>window.onload=()=>{window.print();window.close()}<\/script></body></html>
    `);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 pb-12 px-4 max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 text-center">
          <h1 className="font-heading font-bold text-3xl mb-2">QR Code Generator</h1>
          <p className="text-muted-foreground">Generate blockchain-verified QR codes for your products.</p>
        </motion.div>

        <Card className="glass">
          <CardHeader className="text-center">
            <CardTitle className="font-heading flex items-center justify-center gap-2">
              <QrCode className="h-5 w-5 text-secondary" /> Generate QR Code
            </CardTitle>
            <CardDescription>Enter a product ID to generate a scannable QR code</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label>Product ID</Label>
              <Input value={productId} onChange={e => { setProductId(e.target.value); setGenerated(false); }} placeholder="PROD-001" />
            </div>

            <Button onClick={handleGenerate} disabled={loading} className="w-full bg-primary text-primary-foreground">
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <QrCode className="h-4 w-4 mr-2" />}
              Generate QR Code
            </Button>

            {generated && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
                <div ref={qrRef} className="flex justify-center p-8 bg-card rounded-xl border border-border">
                  <QRCodeSVG value={verifyUrl} size={240} bgColor="transparent" fgColor="hsl(152, 55%, 23%)" level="H" />
                </div>
                <p className="text-center text-xs text-muted-foreground font-mono break-all">{verifyUrl}</p>
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1" onClick={handleDownload}>
                    <Download className="h-4 w-4 mr-2" /> Download PNG
                  </Button>
                  <Button variant="outline" className="flex-1" onClick={handlePrint}>
                    <Printer className="h-4 w-4 mr-2" /> Print Label
                  </Button>
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
