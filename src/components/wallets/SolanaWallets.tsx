import { Wallet } from '@/lib/wallet';
import { Keypair } from '@solana/web3.js';
import { useEffect, useState } from 'react';

export default function SolanaWallets({
    keypair,
}: {
    keypair: Keypair | null;
}) {
    const [balance, setBalance] = useState('');

    useEffect(() => {
        if (keypair) {
            Wallet.getBalanceSol(keypair.publicKey.toBase58()).then(
                (balance) => {
                    setBalance(String(balance));
                },
            );
        }
    }, []);

    if (!keypair) {
        return <>No Wallet</>;
    }

    return (
        <div className="flex flex-col gap-4 justify-center items-center h-[50vh]">
            <div className='flex flex-col justify-center items-center'>
                <p className='font-semibolc text-4xl'>{balance}</p>
                <p>Coins Available</p>
            </div>
            <div>{keypair.publicKey.toBase58()}</div>
        </div>
    );
}
