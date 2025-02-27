import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "@/components/ui/sonner";
import { BrowserRouter, Route, Routes } from "react-router";
import Home from "@/routes/HomeRoute";

import "./index.css";
import { AppProvider } from "./contexts/AppContext";
import WalletRoute from "./routes/WalletRoute";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <AppProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path=":coin" element={<WalletRoute />} />
                </Routes>
            </BrowserRouter>
        </AppProvider>
        <Toaster richColors />
    </StrictMode>
);
