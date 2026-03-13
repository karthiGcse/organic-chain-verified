import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Shield, Leaf, Truck, QrCode, Award, BarChart3, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };

const steps = [
  { emoji: "🌱", label: "Farm", desc: "Organic cultivation" },
  { emoji: "✂️", label: "Harvest", desc: "Quality checked" },
  { emoji: "🚛", label: "Transport", desc: "Cold chain tracked" },
  { emoji: "🏭", label: "Storage", desc: "Conditions monitored" },
  { emoji: "🏪", label: "Retail", desc: "Verified delivery" },
];

const stats = [
  { value: "10,000+", label: "Products Tracked" },
  { value: "2,500+", label: "Verified Farmers" },
  { value: "99.9%", label: "Uptime" },
  { value: "50+", label: "Supply Chains" },
];

const features = [
  { icon: Shield, title: "Full Transparency", desc: "Every step recorded immutably on the blockchain." },
  { icon: Award, title: "Organic Certification", desc: "Verify certification numbers and organic status instantly." },
  { icon: Truck, title: "Real-time Tracking", desc: "Follow your produce through every stage of the supply chain." },
  { icon: QrCode, title: "QR Verification", desc: "Scan a QR code to see the full journey of any product." },
  { icon: BarChart3, title: "Analytics", desc: "Insights and metrics for farmers and distributors." },
  { icon: Leaf, title: "Sustainability", desc: "Promoting sustainable farming practices through accountability." },
];

const testimonials = [
  { name: "Maria Santos", role: "Organic Farmer", text: "OrganicChain has completely transformed how I prove my produce is genuinely organic. My customers trust me more than ever." },
  { name: "James Mitchell", role: "Supply Chain Manager", text: "The transparency this platform provides is unmatched. We can track every shipment with blockchain-verified accuracy." },
  { name: "Sarah Chen", role: "Health Food Store Owner", text: "My customers love scanning the QR code and seeing exactly where their food came from. It's a game changer for trust." },
];

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-1/4 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.6 }}>
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold bg-secondary/20 text-primary border border-secondary/30 mb-6">
              🌿 Blockchain-Powered Traceability
            </span>
            <h1 className="font-heading font-extrabold text-4xl sm:text-5xl lg:text-6xl leading-tight mb-6">
              Know Exactly Where Your{" "}
              <span className="gradient-text">Food Comes From</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              OrganicChain uses Ethereum blockchain technology to create an immutable, transparent record of every organic product's journey from farm to table.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground text-base px-8">
                <Link to="/dashboard">Start Tracking <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-base px-8">
                <Link to="/verify">Verify Product</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.5 }} className="text-center mb-14">
            <h2 className="font-heading font-bold text-3xl sm:text-4xl mb-3">How It Works</h2>
            <p className="text-muted-foreground">Five steps from farm to your table, all verified on blockchain.</p>
          </motion.div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {steps.map((s, i) => (
              <motion.div key={s.label} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: i * 0.1, duration: 0.5 }} className="flex flex-col items-center text-center flex-1">
                <div className="w-20 h-20 rounded-2xl glass flex items-center justify-center text-3xl mb-3 glow-green">
                  {s.emoji}
                </div>
                <h3 className="font-heading font-semibold text-base">{s.label}</h3>
                <p className="text-xs text-muted-foreground mt-1">{s.desc}</p>
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute">
                    <ArrowRight className="h-4 w-4 text-secondary mt-2" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <motion.div key={s.label} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: i * 0.1 }} className="glass rounded-2xl p-6 text-center glow-green">
              <div className="font-heading font-extrabold text-3xl text-primary mb-1">{s.value}</div>
              <div className="text-sm text-muted-foreground">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-14">
            <h2 className="font-heading font-bold text-3xl sm:text-4xl mb-3">Platform Features</h2>
            <p className="text-muted-foreground">Everything you need for complete organic produce traceability.</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div key={f.title} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: i * 0.08 }} className="glass rounded-2xl p-6 hover:glow-green transition-shadow duration-300">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <f.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-heading font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-14">
            <h2 className="font-heading font-bold text-3xl sm:text-4xl mb-3">What People Say</h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div key={t.name} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: i * 0.1 }} className="glass rounded-2xl p-6">
                <Quote className="h-8 w-8 text-secondary/40 mb-4" />
                <p className="text-sm text-muted-foreground mb-4 italic">"{t.text}"</p>
                <div>
                  <p className="font-heading font-semibold text-sm">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
