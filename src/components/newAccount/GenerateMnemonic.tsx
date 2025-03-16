import { useNavigate } from "react-router";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { useEffect, useState } from "react";
import { generateMnemonic, mnemonicToSeedSync } from "bip39";
import { toast } from "sonner";
import { v4 as uuidV4 } from "uuid";
import { ArrowLeft } from "lucide-react";
import { Ethereum } from "@/lib/ethereum";
import { Solana } from "@/lib/solana";

export function GenerateMnemonic() {
    const navigate = useNavigate();

    const [mnemonics, setMnemonics] = useState('');
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        const mnemonics = generateMnemonic();
        setMnemonics(mnemonics);
    }, []);

    const handleCopyToClipboard = () => {
        navigator.clipboard.writeText(mnemonics);
        toast.success('Copied to Clipboard');
    };

    const handleCreate = () => {
        const seed = mnemonicToSeedSync(mnemonics);
        localStorage.setItem('seed', seed.toString('hex'));

        const keypair = Solana.createWallet(0);
        const wallet = Ethereum.createWallet(0);

        const id = uuidV4();
        const accountMetadata = [
            {
                id,
                name: 'Account 1',
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
            derivationIndex: 0,
            chains: {
                eth: {
                    chainType: 'ethereum',
                    chainName: 'Ethereum',
                    symbol: 'ETH',
                    publicKey: wallet.address,
                    privateKey: wallet.privateKey,
                },
                sol: {
                    chainType: 'solana',
                    chainName: 'Solana',
                    symbol: 'SOL',
                    publicKey: keypair.publicKey,
                    privateKey: keypair.secretKey,
                },
            },
        };

        localStorage.setItem('accounts', JSON.stringify([account]));
        localStorage.setItem('selectedAccount', id);

        navigate('/accounts');
    };

    return (
        <div className="flex flex-col justify-between h-full text-white">
            <div className="flex items-center border-b-2 p-4">
                <ArrowLeft
                    className="cursor-pointer"
                    onClick={() => navigate(-1)}
                />
                <p className="font-semibold flex-grow flex justify-center">
                    Your Recovery Phrase
                </p>
            </div>
            <div className="h-full p-4 flex flex-col gap-4">
                <div className="p-4 flex flex-col items-center justify-center gap-0.5 rounded-lg bg-red-500/10 border-red-500 border">
                    <p className="font-semibold text-red-600">
                        Do not share your recovery phrase!
                    </p>
                    <p className="font-medium text-red-500 text-center text-sm">
                        If someone has your Recovery Phrase they will have full
                        control of your wallet.
                    </p>
                </div>

                <div
                    onClick={handleCopyToClipboard}
                    className="flex flex-col items-center justify-center cursor-pointer w-full"
                >
                    <ul className="grid grid-cols-3 gap-4 w-full p-2">
                        {mnemonics.split(' ').map((mnemonic, index) => (
                            <li
                                key={index}
                                className="col-span-1 flex gap-1 items-center justify-start"
                            >
                                <p>{index + 1}.</p>
                                <p>{mnemonic}</p>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="flex items-center space-x-2 mb-2">
                    <Checkbox
                        checked={checked}
                        onCheckedChange={(val: boolean) => setChecked(val)}
                        id="confirmation"
                    />
                    <label
                        htmlFor="confirmation"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                        I Saved my Recovery Phrase
                    </label>
                </div>
            </div>
            <div className="flex items-center border-t-2 p-4">
                <Button
                    disabled={!checked}
                    className="w-full"
                    onClick={handleCreate}
                >
                    Create
                </Button>
            </div>
        </div>
    );
}