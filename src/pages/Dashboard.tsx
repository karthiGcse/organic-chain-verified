import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Package, UserCheck, Clock, Plus, Loader2, ExternalLink, Tractor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useWeb3 } from "@/contexts/Web3Context";
import { ETHERSCAN_BASE } from "@/lib/contract";
import { getContract, getSignerContract } from "@/hooks/useContract";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";

type ProductItem = {
  productId: string;
  name: string;
  category: string;
  farmLocation: string;
  isOrganic: boolean;
  registeredAt: number;
};

export default function Dashboard() {
  const { account } = useWeb3();
  const [txLoading, setTxLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [farmerInfo, setFarmerInfo] = useState<{ name: string; location: string; certId: string; isVerified: boolean } | null>(null);
  const [farmerStatus, setFarmerStatus] = useState("Not Registered");

  // Register farmer form
  const [farmerName, setFarmerName] = useState("");
  const [farmerLocation, setFarmerLocation] = useState("");
  const [farmerCert, setFarmerCert] = useState("");

  // Add product form
  const [prodId, setProdId] = useState("");
  const [prodName, setProdName] = useState("");
  const [prodCategory, setProdCategory] = useState("");
  const [prodLocation, setProdLocation] = useState("");
  const [prodCert, setProdCert] = useState("");
  const [prodImage, setProdImage] = useState("");

  const [addProductOpen, setAddProductOpen] = useState(false);

  const loadFarmerStatus = useCallback(async (address: string) => {
    try {
      const contract = await getContract();
      const farmer = await contract.farmers(address);
      if (farmer.isVerified === true) {
        setFarmerStatus("Registered");
      } else {
        setFarmerStatus("Not Registered");
      }
      setFarmerInfo({
        name: farmer.name,
        location: farmer.location,
        certId: farmer.certificationId,
        isVerified: farmer.isVerified,
      });
    } catch (error: any) {
      setFarmerStatus("Not Registered");
      setFarmerInfo(null);
      if (error?.message) {
        console.warn("Failed to load farmer status:", error.message);
      }
    }
  }, []);

  const loadProducts = useCallback(async (address: string) => {
    try {
      const contract = await getContract();
      const productIds: string[] = await contract.getFarmerProducts(address);
      const productData = await Promise.all(
        productIds.map(async (id) => {
          const p = await contract.getProduct(id);
          return {
            productId: p.productId,
            name: p.name,
            category: p.category,
            farmLocation: p.farmLocation,
            isOrganic: p.isOrganic,
            registeredAt: Number(p.registeredAt),
          };
        })
      );
      setProducts(productData);
      setTotalProducts(productIds.length);
    } catch (error: any) {
      setProducts([]);
      setTotalProducts(0);
      if (error?.message) {
        console.warn("Failed to load products:", error.message);
      }
    }
  }, []);

  const loadDashboardData = useCallback(async (address: string) => {
    setDataLoading(true);
    try {
      await Promise.all([loadFarmerStatus(address), loadProducts(address)]);
    } finally {
      setDataLoading(false);
    }
  }, [loadFarmerStatus, loadProducts]);

  useEffect(() => {
    if (!account) {
      setFarmerStatus("Not Registered");
      setFarmerInfo(null);
      setProducts([]);
      setTotalProducts(0);
      return;
    }
    loadDashboardData(account);
  }, [account, loadDashboardData]);

  const handleRegisterFarmer = async () => {
    if (!account) {
      toast.error("Connect your wallet first");
      return;
    }

    setTxLoading(true);
    try {
      const contract = await getSignerContract();
      const tx = await contract.registerFarmer(farmerName, farmerLocation, farmerCert);
      toast.info("Transaction submitted. Waiting for confirmation...");
      const receipt = await tx.wait();
      toast.success(
        <div className="space-y-1">
          <p>Farmer registered successfully!</p>
          <a href={`${ETHERSCAN_BASE}/tx/${receipt.hash}`} target="_blank" rel="noopener noreferrer" className="text-xs underline flex items-center gap-1">
            View on Etherscan <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      );
      setFarmerName("");
      setFarmerLocation("");
      setFarmerCert("");
      await loadFarmerStatus(account);
    } catch (err: any) {
      toast.error(err?.reason || err?.message || "Transaction failed");
    } finally {
      setTxLoading(false);
    }
  };

  const handleAddProduct = async () => {
    if (!account) {
      toast.error("Connect your wallet first");
      return;
    }

    setTxLoading(true);
    try {
      const contract = await getSignerContract();
      const tx = await contract.addProduct(prodId, prodName, prodCategory, prodLocation, prodCert, prodImage || "");
      toast.info("Transaction submitted. Waiting for confirmation...");
      const receipt = await tx.wait();
      toast.success(
        <div className="space-y-1">
          <p>Product added to blockchain!</p>
          <a href={`${ETHERSCAN_BASE}/tx/${receipt.hash}`} target="_blank" rel="noopener noreferrer" className="text-xs underline flex items-center gap-1">
            View on Etherscan <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      );
      setProdId("");
      setProdName("");
      setProdCategory("");
      setProdLocation("");
      setProdCert("");
      setProdImage("");
      setAddProductOpen(false);
      await loadProducts(account);
    } catch (err: any) {
      toast.error(err?.reason || err?.message || "Transaction failed");
    } finally {
      setTxLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 pb-12 px-4 max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="font-heading font-bold text-3xl mb-2">Farmer Dashboard</h1>
          <p className="text-muted-foreground">
            {account ? `Connected: ${account.slice(0, 6)}...${account.slice(-4)}` : "Connect your wallet to manage your farm"}
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            { icon: Package, label: "Total Products", value: products.length, color: "text-primary" },
            { icon: UserCheck, label: "Status", value: isRegistered ? "Registered" : "Not Registered", color: "text-secondary" },
            { icon: Clock, label: "Verified", value: products.filter(p => p?.isOrganic).length, color: "text-accent" },
          ].map((s) => (
            <Card key={s.label} className="glass">
              <CardContent className="pt-6 flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center ${s.color}`}>
                  <s.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                  <p className="font-heading font-bold text-2xl">{s.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Register Farmer */}
          <Card className="glass lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-heading">
                <Tractor className="h-5 w-5 text-secondary" />
                Register Farmer
              </CardTitle>
              <CardDescription>Register your farm on the blockchain</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="fName">Farm Name</Label>
                <Input id="fName" value={farmerName} onChange={e => setFarmerName(e.target.value)} placeholder="Green Valley Farm" />
              </div>
              <div>
                <Label htmlFor="fLoc">Location</Label>
                <Input id="fLoc" value={farmerLocation} onChange={e => setFarmerLocation(e.target.value)} placeholder="California, USA" />
              </div>
              <div>
                <Label htmlFor="fCert">Certification ID</Label>
                <Input id="fCert" value={farmerCert} onChange={e => setFarmerCert(e.target.value)} placeholder="CERT-2024-001" />
              </div>
              <Button onClick={handleRegisterFarmer} disabled={loading || !account} className="w-full bg-primary text-primary-foreground">
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Register on Blockchain
              </Button>
              {farmerInfo && (
                <div className="p-3 rounded-lg bg-secondary/10 border border-secondary/20 text-sm">
                  <p className="font-semibold text-primary">{farmerInfo.name}</p>
                  <p className="text-muted-foreground text-xs">{farmerInfo.location}</p>
                  <Badge variant="secondary" className="mt-1 text-xs">Registered ✓</Badge>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Products Table */}
          <Card className="glass lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="font-heading">Products</CardTitle>
                <CardDescription>Your registered organic products</CardDescription>
              </div>
              <Dialog open={addProductOpen} onOpenChange={setAddProductOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="bg-primary text-primary-foreground">
                    <Plus className="h-4 w-4 mr-1" /> Add Product
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="font-heading">Add New Product</DialogTitle>
                    <DialogDescription>Register a new organic product on the blockchain</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-3">
                    <div>
                      <Label>Product ID</Label>
                      <Input value={prodId} onChange={e => setProdId(e.target.value)} placeholder="PROD-001" />
                    </div>
                    <div>
                      <Label>Product Name</Label>
                      <Input value={prodName} onChange={e => setProdName(e.target.value)} placeholder="Organic Tomatoes" />
                    </div>
                    <div>
                      <Label>Category</Label>
                      <Select value={prodCategory} onValueChange={setProdCategory}>
                        <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                        <SelectContent>
                          {["Vegetables", "Fruits", "Grains", "Dairy", "Herbs"].map(c => (
                            <SelectItem key={c} value={c.toLowerCase()}>{c}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Farm Location</Label>
                      <Input value={prodLocation} onChange={e => setProdLocation(e.target.value)} placeholder="Farm location" />
                    </div>
                    <div>
                      <Label>Certification Number</Label>
                      <Input value={prodCert} onChange={e => setProdCert(e.target.value)} placeholder="CERT-2024-001" />
                    </div>
                    <div>
                      <Label>Image Hash (optional)</Label>
                      <Input value={prodImage} onChange={e => setProdImage(e.target.value)} placeholder="IPFS hash or URL" />
                    </div>
                    <Button onClick={handleAddProduct} disabled={loading} className="w-full bg-primary text-primary-foreground">
                      {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                      Add to Blockchain
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {products.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Package className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p>No products registered yet.</p>
                  <p className="text-xs mt-1">Connect your wallet and add your first product.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products.map((p) => (
                        <TableRow key={p.productId}>
                          <TableCell className="font-mono text-xs">{p.productId}</TableCell>
                          <TableCell className="font-medium">{p.name}</TableCell>
                          <TableCell className="capitalize">{p.category}</TableCell>
                          <TableCell>{p.farmLocation}</TableCell>
                          <TableCell>
                            <Badge variant={p.isOrganic ? "default" : "secondary"} className={p.isOrganic ? "bg-secondary text-secondary-foreground" : ""}>
                              {p.isOrganic ? "Organic ✓" : "Pending"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
