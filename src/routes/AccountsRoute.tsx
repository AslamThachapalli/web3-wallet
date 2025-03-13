import { cn } from '@/lib/utils';
import { ArrowLeft, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function AccountsRoute() {
    const [accounts, setAccounts] = useState([]);
    const [selectedAccount, setSelectedAccount] = useState('');

    useEffect(() => {
        const accounts = JSON.parse(
            localStorage.getItem('accountMetadata')!,
        ).accounts;
        setAccounts(accounts);

        setSelectedAccount(localStorage.getItem('selectedAccount') || '');
    }, []);

    const getAbbrevation = (accountName: string) => {
        const nameList = accountName.split(' ');

        let abbrev = nameList[0][0];

        if (nameList.length > 1) {
            abbrev += nameList[1][0];
        }

        return abbrev;
    };

    return (
        <div className="h-full p-3">
            <div className="h-full w-[80px] bg-black rounded-lg shadow-xl flex flex-col justify-center items-center text-slate-400 py-4 px-2">
                <ArrowLeft className="w-5 h-5 hover:bg-white hover:text-black rounded-md cursor-pointer" />
                <div className="flex-grow py-4">
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
                <Plus className="w-5 h-5 cursor-pointer" />
            </div>
        </div>
    );
}
