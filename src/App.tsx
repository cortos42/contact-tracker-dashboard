
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
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
  const [bucketError, setBucketError] = useState<string | null>(null);

  useEffect(() => {
    // Create documents bucket on app initialization
    createDocumentsBucket()
      .catch((error) => {
        console.error("Error creating documents bucket:", error);
        setBucketError("Erreur lors de la création du bucket de documents. Les fonctionnalités de stockage pourraient être limitées.");
        // Continue with the app despite bucket creation errors
      });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ContactProvider>
          <Toaster />
          <Sonner />
          {bucketError && (
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 fixed top-0 right-0 left-0 z-50" role="alert">
              <p>{bucketError}</p>
            </div>
          )}
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
