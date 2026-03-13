import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Web3Provider } from "@/contexts/Web3Context";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Tracker from "./pages/Tracker";
import QRCodePage from "./pages/QRCode";
import Verify from "./pages/Verify";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Web3Provider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/tracker" element={<Tracker />} />
            <Route path="/qr" element={<QRCodePage />} />
            <Route path="/verify" element={<Verify />} />
            <Route path="/verify/:productId" element={<Verify />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Web3Provider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
