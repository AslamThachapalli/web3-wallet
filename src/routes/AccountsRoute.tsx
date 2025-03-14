import { cn, getAbbrevation } from '@/lib/utils';
import { ArrowLeft, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

export default function AccountsRoute() {
    const navigate = useNavigate();

    const [accounts, setAccounts] = useState([]);
    const [selectedAccount, setSelectedAccount] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    useEffect(() => {
        const accounts = JSON.parse(
            localStorage.getItem('accountMetadata')!,
        ).accounts;
        setAccounts(accounts);

        setSelectedAccount(localStorage.getItem('selectedAccount') || '');
    }, []);

    const handleAddWallet = () => {
        setIsSidebarOpen(false);
        navigate('/add-wallet');
    };

    return (
        <div
            className="h-full p-3 relative overflow-hidden"
            onClick={() => setIsSidebarOpen(false)}
        >
            <div className="relative z-0">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsSidebarOpen(true);
                    }}
                    className="p-2 rounded-md hover:bg-gray-600"
                >
                    Button
                </button>

                {/* Your main content goes here */}
                <div className="mt-4">
                    <h1 className="text-white text-xl">Your Accounts</h1>
                    {/* Other content */}
                </div>
            </div>

            <div
                className={cn([
                    'absolute top-0 left-0 z-10 h-full py-4 px-2 transition-transform duration-300 ease-in-out transform',
                    isSidebarOpen ? 'translate-x-0' : '-translate-x-full',
                ])}
            >
                <div
                    className="h-full w-[80px] bg-black rounded-lg shadow-xl flex flex-col justify-center items-center text-slate-400  py-4 px-2"
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                >
                    <ArrowLeft
                        className="w-5 h-5 hover:bg-white hover:text-black rounded-md cursor-pointer"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                    <div className="flex-grow py-4 flex flex-col gap-2">
                        {accounts.map((account: any) => (
                            <div
                                key={account.id}
                                className="flex flex-col gap-1 justify-center items-center cursor-pointer"
                            >
                                <div
                                    className={cn([
                                        'rounded-full p-2 w-12 h-12 flex items-center justify-center font-semibold',
                                        selectedAccount === account.id
                                            ? 'bg-indigo-400 text-black'
                                            : 'bg-gray-400 text-white',
                                    ])}
                                >
                                    {getAbbrevation(account.name)}
                                </div>
                                <p
                                    className={cn([
                                        'text-[10px] truncate w-16 text-center',
                                        selectedAccount === account.id &&
                                            'text-indigo-400',
                                    ])}
                                >
                                    {account.name}
                                </p>
                            </div>
                        ))}
                    </div>
                    <Plus
                        className="w-5 h-5 cursor-pointer"
                        onClick={handleAddWallet}
                    />
                </div>
            </div>
        </div>
    );
}
