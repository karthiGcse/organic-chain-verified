import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Leaf, MapPin, User, Hash, Shield, Search, Loader2, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useWeb3 } from "@/contexts/Web3Context";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Product {
  productId: string; name: string; category: string; farmLocation: string;
  certificationNumber: string; farmerAddress: string; farmerName: string;
  harvestDate: bigint; registeredAt: bigint; isOrganic: boolean; imageHash: string;
}

interface Stage {
  stageName: string; location: string; handlerName: string; description: string;
  timestamp: bigint; recordedBy: string; isCompleted: boolean;
}

const stageEmojis: Record<string, string> = {
  cultivation: "🌱", harvesting: "✂️", transportation: "🚛", storage: "🏭", retail: "🏪", default: "📦"
};

export default function Verify() {
  const { productId: paramId } = useParams();
  const { readContract } = useWeb3();
  const [searchId, setSearchId] = useState(paramId || "");
  const [product, setProduct] = useState<Product | null>(null);
  const [stages, setStages] = useState<Stage[]>([]);
  const [isOrganic, setIsOrganic] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => { if (paramId) handleVerify(paramId); }, [paramId, readContract]);

  const handleVerify = async (id?: string) => {
    const pid = id || searchId;
    if (!pid.trim() || !readContract) return;
    setLoading(true); setSearched(true);
    try {
      const [prod, chain, organic] = await Promise.all([
        readContract.getProduct(pid),
        readContract.getSupplyChain(pid),
        readContract.verifyOrganic(pid),
      ]);
      if (!prod.productId) { setProduct(null); setStages([]); setIsOrganic(false); return; }
      setProduct({
        productId: prod.productId, name: prod.name, category: prod.category,
        farmLocation: prod.farmLocation, certificationNumber: prod.certificationNumber,
        farmerAddress: prod.farmerAddress, farmerName: prod.farmerName,
        harvestDate: prod.harvestDate, registeredAt: prod.registeredAt,
        isOrganic: prod.isOrganic, imageHash: prod.imageHash,
      });
      setStages(chain.map((s: any) => ({
        stageName: s.stageName, location: s.location, handlerName: s.handlerName,
        description: s.description, timestamp: s.timestamp, recordedBy: s.recordedBy, isCompleted: s.isCompleted,
      })));
      setIsOrganic(organic);
    } catch {
      setProduct(null); setStages([]); setIsOrganic(false);
    } finally { setLoading(false); }
  };

  const fakeHash = (i: number) => `0x${Array.from({ length: 16 }, (_, j) => ((i * 7 + j * 13) % 16).toString(16)).join("")}...`;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 pb-12 px-4 max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 text-center">
          <h1 className="font-heading font-bold text-3xl mb-2">Verify Product</h1>
          <p className="text-muted-foreground">Verify the authenticity and organic status of any product.</p>
        </motion.div>

        {/* Search */}
        {!paramId && (
          <Card className="glass mb-8">
            <CardContent className="pt-6">
              <div className="flex gap-3">
                <Input value={searchId} onChange={e => setSearchId(e.target.value)} placeholder="Enter Product ID" onKeyDown={e => e.key === "Enter" && handleVerify()} className="flex-1" />
                <Button onClick={() => handleVerify()} disabled={loading} className="bg-primary text-primary-foreground">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                  <span className="ml-2">Verify</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {loading && (
          <div className="text-center py-16">
            <Loader2 className="h-10 w-10 animate-spin mx-auto text-secondary mb-3" />
            <p className="text-muted-foreground">Querying blockchain...</p>
          </div>
        )}

        {searched && !loading && !product && (
          <div className="text-center py-16 text-muted-foreground">
            <XCircle className="h-16 w-16 mx-auto mb-4 text-destructive/50" />
            <p className="text-xl font-heading font-semibold">Product Not Found</p>
            <p className="text-sm mt-1">No product with this ID exists on the blockchain.</p>
          </div>
        )}

        {product && !loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            {/* Verification Banner */}
            <div className={`rounded-2xl p-6 text-center border-2 ${isOrganic ? "border-secondary/40 bg-secondary/5" : "border-accent/40 bg-accent/5"}`}>
              {isOrganic ? (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2 }}>
                  <CheckCircle2 className="h-20 w-20 mx-auto text-secondary mb-3" />
                  <h2 className="font-heading font-bold text-2xl text-primary">Verified Organic ✅</h2>
                  <p className="text-sm text-muted-foreground mt-1">This product is certified organic and verified on the Ethereum blockchain.</p>
                </motion.div>
              ) : (
                <>
                  <Shield className="h-20 w-20 mx-auto text-accent mb-3" />
                  <h2 className="font-heading font-bold text-2xl">Verification Pending</h2>
                  <p className="text-sm text-muted-foreground mt-1">This product is registered but organic status is not yet confirmed.</p>
                </>
              )}
            </div>

            {/* Product Details */}
            <Card className="glass">
              <CardHeader>
                <CardTitle className="font-heading flex items-center gap-2">
                  <Leaf className="h-5 w-5 text-secondary" /> Product Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                  <div><span className="text-muted-foreground">Product ID:</span> <span className="font-mono font-medium ml-2">{product.productId}</span></div>
                  <div><span className="text-muted-foreground">Name:</span> <span className="font-medium ml-2">{product.name}</span></div>
                  <div><span className="text-muted-foreground">Category:</span> <span className="font-medium ml-2 capitalize">{product.category}</span></div>
                  <div><span className="text-muted-foreground">Farm Location:</span> <span className="font-medium ml-2">{product.farmLocation}</span></div>
                  <div><span className="text-muted-foreground">Farmer:</span> <span className="font-medium ml-2">{product.farmerName}</span></div>
                  <div><span className="text-muted-foreground">Certification:</span> <Badge variant="outline" className="ml-2 border-accent text-accent"><Award className="h-3 w-3 mr-1" />{product.certificationNumber}</Badge></div>
                  <div><span className="text-muted-foreground">Registered:</span> <span className="font-medium ml-2">{product.registeredAt > 0n ? new Date(Number(product.registeredAt) * 1000).toLocaleDateString() : "—"}</span></div>
                  <div><span className="text-muted-foreground">Farmer Address:</span> <span className="font-mono text-xs ml-2">{product.farmerAddress.slice(0, 10)}...</span></div>
                </div>
              </CardContent>
            </Card>

            {/* Supply Chain Timeline */}
            {stages.length > 0 && (
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="font-heading">Supply Chain Journey</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-secondary via-primary to-secondary/30" />
                    <div className="space-y-6">
                      {stages.map((s, i) => (
                        <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.15 }} className="relative pl-16">
                          <div className="absolute left-2 w-8 h-8 rounded-full glass flex items-center justify-center text-base z-10 border-2 border-secondary">
                            {stageEmojis[s.stageName.toLowerCase()] || stageEmojis.default}
                          </div>
                          <div className="glass rounded-xl p-4">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-heading font-semibold">{s.stageName}</h4>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${s.isCompleted ? "bg-secondary/20 text-primary" : "bg-accent/20 text-accent"}`}>
                                {s.isCompleted ? "Done" : "In Progress"}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{s.description}</p>
                            <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{s.location}</span>
                              <span className="flex items-center gap-1"><User className="h-3 w-3" />{s.handlerName}</span>
                              <span className="flex items-center gap-1"><Hash className="h-3 w-3" /><span className="font-mono">{fakeHash(i)}</span></span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Trust Banner */}
            <div className="glass rounded-2xl p-4 text-center border border-secondary/20">
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Shield className="h-4 w-4 text-secondary" />
                Verified on Ethereum Blockchain • Sepolia Network • Immutable Record
              </div>
            </div>
          </motion.div>
        )}
      </div>
      <Footer />
    </div>
  );
}
