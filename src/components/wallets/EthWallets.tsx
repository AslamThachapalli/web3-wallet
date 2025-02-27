import { Wallet } from '@/lib/wallet';
import { Wallet as EthWallet } from 'ethers';
import { useEffect, useState } from 'react';

export default function EthWallets({ wallet }: { wallet: EthWallet | null }) {
    const [balance, setBalance] = useState('');

    useEffect(() => {
        if (wallet) {
            Wallet.getBalanceEth(wallet.address).then((balance) => {
                setBalance(String(balance));
            });
        }
    }, []);

    if (!wallet) {
        return <>No Wallet</>;
    }

    return (
        <div className="flex flex-col gap-4 justify-center items-center h-[50vh]">
            <div className='flex flex-col justify-center items-center'>
                <p className='font-semibolc text-4xl'>{balance}</p>
                <p>Coins Available</p>
            </div>
            <div>{wallet.address}</div>
        </div>
    );
}
