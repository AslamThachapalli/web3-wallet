import { Keypair } from '@solana/web3.js';
import { Wallet } from 'ethers';
import React, { createContext, useContext, useState } from 'react';

interface SelectedWalletType {
    coin: 'eth' | 'sol';
    wallet: number;
}

interface AppContextProps {
    solanaKeypairs: Keypair[];
    ethWallets: Wallet[];
    selectedWallet: SelectedWalletType | undefined;
    setSolanaKeypairs: React.Dispatch<React.SetStateAction<Keypair[]>>;
    setEthWallets: React.Dispatch<React.SetStateAction<Wallet[]>>;
    setSelectedWallet: React.Dispatch<
        React.SetStateAction<SelectedWalletType | undefined>
    >;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
    const [solanaKeypairs, setSolanaKeypairs] = useState<Keypair[]>([]);
    const [ethWallets, setEthWallets] = useState<Wallet[]>([]);
    const [selectedWallet, setSelectedWallet] = useState<
        SelectedWalletType | undefined
    >(undefined);

    return (
        <AppContext.Provider
            value={{
                solanaKeypairs,
                setSolanaKeypairs,
                ethWallets,
                setEthWallets,
                selectedWallet,
                setSelectedWallet,
            }}
        >
            {children}
        </AppContext.Provider>
    );
}

export function useAppContext() {
    const context = useContext(AppContext);

    if (!context) {
        throw Error('AppContext can only be accessed inside AppProvider');
    }

    return context;
}
