import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Plus, Loader2, ExternalLink, MapPin, User, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { useWeb3 } from "@/contexts/Web3Context";
import { ETHERSCAN_BASE } from "@/lib/contract";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";

const stageEmojis: Record<string, string> = {
  cultivation: "🌱", harvesting: "✂️", transportation: "🚛", storage: "🏭", retail: "🏪",
  default: "📦"
};

interface Stage {
  stageName: string;
  location: string;
  handlerName: string;
  description: string;
  timestamp: bigint;
  recordedBy: string;
  isCompleted: boolean;
}

export default function Tracker() {
  const { contract, readContract } = useWeb3();
  const [productId, setProductId] = useState("");
  const [stages, setStages] = useState<Stage[]>([]);
  const [searching, setSearching] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  // Add stage form
  const [stageName, setStageName] = useState("");
  const [stageLocation, setStageLocation] = useState("");
  const [stageHandler, setStageHandler] = useState("");
  const [stageDesc, setStageDesc] = useState("");
  const [addOpen, setAddOpen] = useState(false);

  const handleSearch = async () => {
    if (!productId.trim()) { toast.error("Enter a Product ID"); return; }
    setSearching(true);
    setSearched(true);
    try {
      const chain = await readContract!.getSupplyChain(productId);
      setStages(chain.map((s: any) => ({
        stageName: s.stageName, location: s.location, handlerName: s.handlerName,
        description: s.description, timestamp: s.timestamp, recordedBy: s.recordedBy, isCompleted: s.isCompleted,
      })));
    } catch {
      setStages([]);
    } finally { setSearching(false); }
  };

  const handleAddStage = async () => {
    if (!contract) { toast.error("Connect wallet first"); return; }
    setLoading(true);
    try {
      const tx = await contract.addStage(productId, stageName, stageLocation, stageHandler, stageDesc);
      toast.info("Transaction submitted...");
      const receipt = await tx.wait();
      toast.success(
        <div className="space-y-1">
          <p>Stage added!</p>
          <a href={`${ETHERSCAN_BASE}/tx/${receipt.hash}`} target="_blank" rel="noopener noreferrer" className="text-xs underline flex items-center gap-1">
            Etherscan <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      );
      setStageName(""); setStageLocation(""); setStageHandler(""); setStageDesc("");
      setAddOpen(false);
      handleSearch();
    } catch (err: any) {
      toast.error(err?.reason || err?.message || "Failed");
    } finally { setLoading(false); }
  };

  const getEmoji = (name: string) => stageEmojis[name.toLowerCase()] || stageEmojis.default;
  const fakeHash = (idx: number) => `0x${Array.from({ length: 16 }, (_, i) => ((idx * 7 + i * 13) % 16).toString(16)).join("")}...`;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 pb-12 px-4 max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="font-heading font-bold text-3xl mb-2">Supply Chain Tracker</h1>
          <p className="text-muted-foreground">Track the full journey of any organic product.</p>
        </motion.div>

        {/* Search */}
        <Card className="glass mb-8">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <div className="flex-1">
                <Input
                  value={productId}
                  onChange={e => setProductId(e.target.value)}
                  placeholder="Enter Product ID (e.g., PROD-001)"
                  onKeyDown={e => e.key === "Enter" && handleSearch()}
                />
              </div>
              <Button onClick={handleSearch} disabled={searching} className="bg-primary text-primary-foreground">
                {searching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                <span className="ml-2 hidden sm:inline">Search</span>
              </Button>
              <Dialog open={addOpen} onOpenChange={setAddOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline"><Plus className="h-4 w-4" /><span className="ml-2 hidden sm:inline">Add Stage</span></Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="font-heading">Add Supply Chain Stage</DialogTitle>
                    <DialogDescription>Add a new tracking stage for product: {productId || "—"}</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-3">
                    <div>
                      <Label>Stage Name</Label>
                      <Input value={stageName} onChange={e => setStageName(e.target.value)} placeholder="e.g., Cultivation, Harvesting, Transportation" />
                    </div>
                    <div>
                      <Label>Location</Label>
                      <Input value={stageLocation} onChange={e => setStageLocation(e.target.value)} placeholder="City, Country" />
                    </div>
                    <div>
                      <Label>Handler Name</Label>
                      <Input value={stageHandler} onChange={e => setStageHandler(e.target.value)} placeholder="Handler or company" />
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Input value={stageDesc} onChange={e => setStageDesc(e.target.value)} placeholder="Stage details" />
                    </div>
                    <Button onClick={handleAddStage} disabled={loading} className="w-full bg-primary text-primary-foreground">
                      {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                      Submit to Blockchain
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        {/* Timeline */}
        {searched && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {stages.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <p className="text-lg">No supply chain data found for this product.</p>
                <p className="text-sm mt-1">Add the first stage to start tracking.</p>
              </div>
            ) : (
              <div className="relative">
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-secondary via-primary to-secondary/30" />
                <div className="space-y-8">
                  {stages.map((s, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.15 }} className="relative pl-20">
                      <div className="absolute left-4 w-9 h-9 rounded-full glass flex items-center justify-center text-lg glow-green z-10 border-2 border-secondary">
                        {getEmoji(s.stageName)}
                      </div>
                      <Card className="glass hover:glow-green transition-shadow">
                        <CardContent className="pt-5 pb-4">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-heading font-semibold text-lg">{s.stageName}</h3>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${s.isCompleted ? "bg-secondary/20 text-primary" : "bg-accent/20 text-accent"}`}>
                              {s.isCompleted ? "Completed" : "In Progress"}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{s.description}</p>
                          <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {s.location}</div>
                            <div className="flex items-center gap-1"><User className="h-3 w-3" /> {s.handlerName}</div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" /> {s.timestamp > 0n ? new Date(Number(s.timestamp) * 1000).toLocaleDateString() : "—"}
                            </div>
                            <div className="flex items-center gap-1"><Hash className="h-3 w-3" /> <span className="font-mono">{fakeHash(i)}</span></div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}

function Clock(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
  );
}
