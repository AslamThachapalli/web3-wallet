import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Solana } from '@/lib/solana';
import { getAbbrevation } from '@/lib/utils';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { v4 as uuidV4 } from 'uuid';

export default function ImportPrivateKeyRoute() {
    const navigate = useNavigate();

    const [accountName, setAccountName] = useState<string>('');
    const [privateKey, setPrivateKey] = useState<string>('');

    const handleImport = () => {
        if (!privateKey || !accountName) {
            toast.error('Both Account Name and Private Key are required');
            return;
        }

        let keyArray: number[] = [];
        try {
            keyArray = JSON.parse(privateKey);

            if (!Array.isArray(keyArray)) {
                toast.error('Invalid private key format');
                return;
            }

            if (keyArray.length !== 64) {
                toast.error('Invalid private key length');
                return;
            }

            if (
                !keyArray.every(
                    (num) => Number.isInteger(num) && num >= 0 && num <= 255,
                )
            ) {
                toast.error('Invalid private key format');
                return;
            }
        } catch (e) {
            toast.error('Invalid private key format');
            return;
        }
        const keyPair = Solana.createWalletFromPrivateKey(keyArray);

        const metaData = JSON.parse(
            localStorage.getItem('accountMetadata') || '[]',
        );

        const id = uuidV4();
        const accountMetadata = [
            ...metaData.accounts,
            {
                id,
                name: accountName,
            },
        ];
        localStorage.setItem(
            'accountMetadata',
            JSON.stringify({
                accounts: accountMetadata,
            }),
        );

        const accounts = JSON.parse(localStorage.getItem('accounts') || '[]');

        const account = {
            identifier: id,
            type: 'privateKey',
            chains: {
                sol: {
                    chainType: 'solana',
                    chainName: 'Solana',
                    symbol: 'SOL',
                    publicKey: keyPair.publicKey,
                    privateKey: keyPair.secretKey,
                },
            },
        };

        localStorage.setItem(
            'accounts',
            JSON.stringify([...accounts, account]),
        );
        localStorage.setItem('selectedAccount', id);

        navigate('/accounts');
    };

    return (
        <div className="flex flex-col justify-between h-full text-white">
            <div className="flex items-center border-b-2 p-4">
                <ArrowLeft
                    className="cursor-pointer"
                    onClick={() => {
                        navigate(-1);
                    }}
                />
                <p className="font-semibold flex-grow flex justify-center">
                    Import Private Key
                </p>
            </div>
            <div className="h-full p-4 flex flex-col gap-4 items-center">
                <div className="rounded-full p-2 w-20 h-20 flex items-center justify-center font-semibold bg-gray-500 text-white text-3xl">
                    {getAbbrevation(accountName)}
                </div>
                <p className="text-sm text-gray-400">
                    Only Solana is supported for now
                </p>
                <Input
                    className="bg-gray-800 border-gray-600"
                    placeholder="Account Name"
                    value={accountName}
                    onChange={(e) => {
                        setAccountName(e.target.value);
                    }}
                />
                <Textarea
                    className="bg-gray-800 border-gray-600"
                    placeholder="Private Key"
                    value={privateKey}
                    rows={5}
                    onChange={(e) => {
                        setPrivateKey(e.target.value);
                    }}
                />
            </div>
            <div className="flex items-center border-t-2 p-4">
                <Button className="w-full" onClick={handleImport}>
                    Import
                </Button>
            </div>
        </div>
    );
}
