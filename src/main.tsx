import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Toaster } from '@/components/ui/sonner';
import { BrowserRouter, Route, Routes } from 'react-router';

import './index.css';
import { AppProvider } from './contexts/AppContext';
import AddWalletRoute from './routes/AddWalletRoute';
import NewAccountRoute from './routes/NewAccountRoute';
import AccountsRoute from './routes/AccountsRoute';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <AppProvider>
            <div className="flex justify-center items-center h-screen bg-green-50">
                <div className="max-h-[480px] h-full max-w-sm w-full bg-gray-700 rounded-lg shadow-lg">
                    <BrowserRouter>
                        <Routes>
                            <Route
                                path="/accounts"
                                element={<AccountsRoute />}
                            />
                            <Route
                                path="/add-wallet"
                                element={<AddWalletRoute />}
                            />
                            <Route
                                path="/new-account"
                                element={<NewAccountRoute />}
                            />
                        </Routes>
                    </BrowserRouter>
                </div>
            </div>
        </AppProvider>
        <Toaster richColors />
    </StrictMode>,
);
