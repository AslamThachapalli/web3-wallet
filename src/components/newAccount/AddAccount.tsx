import { ArrowLeft } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Wallet } from "@/lib/wallet";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { v4 as uuidV4 } from "uuid";
import { getAbbrevation } from "@/lib/utils";

export function AddAccount() {
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [accounts, setAccounts] = useState([]);

    useEffect(() => {
        const accounts = JSON.parse(localStorage.getItem('accounts') || '[]');
        setAccounts(accounts);

        if (accounts && accounts.length > 0) {
            setName('Account ' + `${accounts.length + 1}`);
        }
    }, []);

    const handleBack = () => {
        navigate(-1);
    };

    const handleCreate = () => {
        if (!name) {
            toast.error('Enter an Account Name to Proceed');
        }

        const derivationIndex = accounts.length;

        const keypair = Wallet.createForSolana(derivationIndex);
        const wallet = Wallet.createForEth(derivationIndex);

        const metaData = JSON.parse(
            localStorage.getItem('accountMetadata') || '[]',
        );
        console.log(metaData);

        const id = uuidV4();
        const accountMetadata = [
            ...metaData.accounts,
            {
                id,
                name,
            },
        ];
        localStorage.setItem(
            'accountMetadata',
            JSON.stringify({
                accounts: accountMetadata,
            }),
        );

        const account = {
            identifier: id,
            type: 'seed',
            derivationIndex,
            chains: {
                eth: {
                    chainType: 'ethereum',
                    publicKey: wallet.address,
                    privateKey: wallet.privateKey,
                },
                sol: {
                    chainType: 'solana',
                    publicKey: keypair.publicKey,
                    privateKey: keypair.secretKey,
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
                <ArrowLeft className="cursor-pointer" onClick={handleBack} />
                <p className="font-semibold flex-grow flex justify-center">
                    Create Account
                </p>
            </div>
            <div className="h-full p-4 flex flex-col gap-4 items-center">
                <div className="rounded-full p-2 w-20 h-20 flex items-center justify-center font-semibold bg-gray-500 text-white text-3xl">
                    {getAbbrevation(name)}
                </div>
                <Input
                    className="bg-gray-800 border-gray-600"
                    placeholder="Account Name"
                    value={name}
                    onChange={(e) => {
                        setName(e.target.value);
                    }}
                />
            </div>
            <div className="flex items-center border-t-2 p-4">
                <div className="flex gap-2 w-full">
                    <Button
                        className="w-full"
                        variant={'secondary'}
                        onClick={handleBack}
                    >
                        Cancel
                    </Button>
                    <Button className="w-full" onClick={handleCreate}>
                        Create
                    </Button>
                </div>
            </div>
        </div>
    );
}