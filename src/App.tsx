
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Contacts from "./pages/Contacts";
import Propositions from "./pages/Propositions";
import Documents from "./pages/Documents";
import Callbacks from "./pages/Callbacks";
import { ContactProvider } from "./context/ContactContext";
import { createDocumentsBucket } from "./utils/createBucket";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Create documents bucket on app initialization
    createDocumentsBucket().catch(console.error);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ContactProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/contacts" element={<Contacts />} />
              <Route path="/propositions" element={<Propositions />} />
              <Route path="/documents" element={<Documents />} />
              <Route path="/callbacks" element={<Callbacks />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </ContactProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
