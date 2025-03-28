import { SidePanel } from '@/components/accounts/SidePanel';
import { Ethereum } from '@/lib/ethereum';
import { Solana } from '@/lib/solana';
import { getAbbrevation } from '@/lib/utils';
import { Copy } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

export default function AccountsRoute() {
    const navigate = useNavigate();

    const [selectedAccount, setSelectedAccount] = useState<any>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [chainBalances, setChainBalances] = useState<Record<string, number>>(
        {},
    );
    const [tokenAccounts, setTokenAccounts] = useState<any[]>([]);

    const loadTokenAccounts = async (publicKey: string) => {
        const tokenAccounts = await Solana.getAllTokenAccounts(publicKey);
        setTokenAccounts(tokenAccounts);
    };

    const loadAccounts = () => {
        setTokenAccounts([]);
        const accountData = localStorage.getItem('accounts');
        const accounts = accountData ? JSON.parse(accountData) : [];

        const accountMetadata = localStorage.getItem('accountMetadata');
        const accountMetadataData = accountMetadata
            ? JSON.parse(accountMetadata)
            : {};

        if (!accounts || accounts.length === 0) {
            navigate('/add-wallet');
            return;
        }

        const selectedAccountId = localStorage.getItem('selectedAccount');
        const selectedAccount = accounts.find(
            (account: any) => account.identifier === selectedAccountId,
        );

        const selectedAccountMetadata = accountMetadataData.accounts.find(
            (account: any) => account.id === selectedAccountId,
        );

        if (selectedAccount.type === 'privateKey') {
            loadTokenAccounts(selectedAccount.chains.sol.publicKey);
        }

        setSelectedAccount({
            ...selectedAccount,
            ...selectedAccountMetadata,
        });
    };

    const loadBalances = async () => {
        setChainBalances({});
        if (!selectedAccount?.chains) return;

        try {
            const balances: Record<string, number> = {};

            for (const chain of Object.values(selectedAccount.chains)) {
                const chainData = chain as any;
                try {
                    const balance = await (chainData.chainType === 'solana'
                        ? Solana.getBalance(chainData.publicKey)
                        : Ethereum.getBalance(chainData.publicKey));
                    balances[chainData.chainType] = balance;
                } catch (error) {
                    console.error(
                        `Error fetching balance for ${chainData.chainType}:`,
                        error,
                    );
                    balances[chainData.chainType] = 0;
                }
            }

            setChainBalances(balances);
        } catch (error) {
            console.error('Error loading balances:', error);
        }
    };

    useEffect(() => {
        loadAccounts();
    }, [navigate]);

    useEffect(() => {
        if (selectedAccount) {
            loadBalances();
        }
    }, [selectedAccount]);

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success('Copied to clipboard');
    };

    return (
        <div
            className="h-full p-3 relative overflow-hidden"
            onClick={() => setIsSidebarOpen(false)}
        >
            <div className="relative z-0 p-3">
                <div className="flex flex-col gap-6">
                    <div className="flex items-center gap-2">
                        <div
                            className="w-9 h-9 p-2 rounded-full bg-gray-500 text-white flex items-center justify-center cursor-pointer"
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsSidebarOpen(true);
                            }}
                        >
                            {getAbbrevation(selectedAccount?.name || '')}
                        </div>
                        <p className="text-white text-lg font-semibold">
                            {selectedAccount?.name}
                        </p>
                    </div>

                    <div className="flex flex-col items-center gap-2">
                        {Object.values(selectedAccount?.chains ?? {}).map(
                            (chain: any) => (
                                <div
                                    key={chain.chainType}
                                    className="bg-gray-500 rounded-lg py-2 px-4 cursor-pointer flex items-center gap-4 w-full text-white"
                                >
                                    <div className="flex flex-col w-full">
                                        <div className="flex items-center justify-between gap-2 w-full">
                                            <p className="font-semibold">
                                                {chain.chainName}
                                            </p>
                                            <div
                                                className="flex items-center justify-end gap-2 group"
                                                onClick={() =>
                                                    handleCopy(chain.publicKey)
                                                }
                                            >
                                                <p className="text-sm">
                                                    {`${chain.publicKey.slice(
                                                        0,
                                                        4,
                                                    )}...${chain.publicKey.slice(
                                                        -4,
                                                    )}`}
                                                </p>
                                                <Copy className="w-4 h-4 cursor-pointer text-gray-400 group-hover:text-white" />
                                            </div>
                                        </div>
                                        <p className="text-sm">
                                            {`${
                                                chainBalances[
                                                    chain.chainType
                                                ] ?? 'Loading...'
                                            } ${chain.symbol}`}
                                        </p>
                                    </div>
                                </div>
                            ),
                        )}
                        {tokenAccounts.map((tokenAccount) => (
                            <div
                                key={tokenAccount.mint}
                                className="bg-gray-500 rounded-lg py-2 px-4 cursor-pointer flex items-center gap-4 w-full text-white"
                            >
                                <div className="flex flex-col w-full">
                                    <div className="flex items-center justify-between gap-2 w-full">
                                        <p className="font-semibold">
                                            {tokenAccount.name}
                                        </p>
                                        <div
                                            className="flex items-center justify-end gap-2 group"
                                            onClick={() =>
                                                handleCopy(tokenAccount.mint)
                                            }
                                        >
                                            <p className="text-sm">
                                                {`${tokenAccount.mint.slice(
                                                    0,
                                                    4,
                                                )}...${tokenAccount.mint.slice(
                                                    -4,
                                                )}`}
                                            </p>
                                            <Copy className="w-4 h-4 cursor-pointer text-gray-400 group-hover:text-white" />
                                        </div>
                                    </div>
                                    <p className="text-sm">
                                        {`${tokenAccount.balance} ${tokenAccount.symbol}`}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <SidePanel
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
                onAccountClick={loadAccounts}
            />
        </div>
    );
}
