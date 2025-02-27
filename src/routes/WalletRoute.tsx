import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuList,
    NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import EthWallets from '@/components/wallets/EthWallets';
import SolanaWallets from '@/components/wallets/SolanaWallets';
import { useAppContext } from '@/contexts/AppContext';
import { Wallet } from '@/lib/wallet';
import { NavigationMenuLink } from '@radix-ui/react-navigation-menu';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';

const coinsDropdown = [
    {
        coinName: 'Solana',
        route: '/sol',
    },
    {
        coinName: 'Etherium',
        route: '/eth',
    },
];

export default function WalletRoute() {
    const { coin } = useParams();
    const navigate = useNavigate();
    const context = useAppContext();
    const [walletNum, setWalletNum] = useState(0);

    useEffect(() => {
        setWalletNum(0)
    },[coin])

    const walletView = (coin: string | undefined) => {
        switch (coin) {
            case 'sol':
                return (
                    <SolanaWallets
                        keypair={context.solanaKeypairs[walletNum] || null}
                    />
                );
            case 'eth':
                return (
                    <EthWallets
                        wallet={context.ethWallets[walletNum] || null}
                    />
                );
            default:
                return <>Not Found</>;
        }
    };

    const getCoinDisplayName = (coin: string | undefined) => {
        switch (coin) {
            case 'sol':
                return 'Solana';
            case 'eth':
                return 'Etherium';
            default:
                return '';
        }
    };

    const getWalletDropdown = (coin: string | undefined) => {
        switch (coin) {
            case 'sol':
                return context.solanaKeypairs;
            case 'eth':
                return context.ethWallets;
            default:
                return [];
        }
    };

    const handleAddNewWallet = (coin: string | undefined) => {
        switch (coin) {
            case 'sol':
                const kp = Wallet.createForSolana(
                    context.solanaKeypairs.length,
                );
                context.setSolanaKeypairs((prev) => [...prev, kp]);
                setWalletNum(context.solanaKeypairs.length);
                break;
            case 'eth':
                const wallet = Wallet.createForEth(context.ethWallets.length);
                context.setEthWallets((prev) => [...prev, wallet]);
                setWalletNum(context.ethWallets.length);
                break;
            default:
                return;
        }
    };

    return (
        <div className="flex flex-col justify-center items-center w-full">
            <div className="max-w-4xl w-full px-4 py-2">
                <NavigationMenu>
                    <NavigationMenuList>
                        <NavigationMenuItem>
                            <NavigationMenuTrigger>{`Wallet ${walletNum + 1}`}</NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <ul className="w-[200px] flex flex-col py-2">
                                    {getWalletDropdown(coin).map((_, index) => (
                                        <li
                                            key={index}
                                            onClick={() => setWalletNum(index)}
                                            className="px-4 py-1 cursor-pointer hover:bg-slate-50"
                                        >
                                            <NavigationMenuLink asChild>
                                                <p>{`Wallet ${index + 1}`}</p>
                                            </NavigationMenuLink>
                                        </li>
                                    ))}
                                    <li
                                        key={`add-wallet-button`}
                                        className="px-4 py-3 cursor-pointer hover:bg-slate-50"
                                        onClick={() => handleAddNewWallet(coin)}
                                    >
                                        <NavigationMenuLink className="flex justify-center items-center gap-2 text-sm">
                                            <Plus className="w-4 h-4" /> Add New
                                            Wallet
                                        </NavigationMenuLink>
                                    </li>
                                </ul>
                            </NavigationMenuContent>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <NavigationMenuTrigger>
                                {getCoinDisplayName(coin)}
                            </NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <ul className="w-[200px] flex flex-col py-2">
                                    {coinsDropdown.map((coin, index) => (
                                        <li
                                            key={index}
                                            className="px-4 py-1 cursor-pointer hover:bg-slate-50"
                                            onClick={() => navigate(coin.route)}
                                        >
                                            <NavigationMenuLink asChild>
                                                <p>{coin.coinName}</p>
                                            </NavigationMenuLink>
                                        </li>
                                    ))}
                                </ul>
                            </NavigationMenuContent>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>
            </div>
            {walletView(coin)}
        </div>
    );
}
