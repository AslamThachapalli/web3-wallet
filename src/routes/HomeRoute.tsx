import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { generateMnemonic } from 'bip39'
import { ArrowRight, Copy } from 'lucide-react'
import { toast } from 'sonner'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Wallet } from '@/lib/wallet'
import { useAppContext } from '@/contexts/AppContext'
import { useNavigate } from 'react-router'

export default function Home() {
  const navigate = useNavigate();
    const { setSolanaKeypairs, setEthWallets } = useAppContext()
    const [mnemonics, setMnemonics] = useState('')
    const [checked, setChecked] = useState(false)
    const [showDialog, setShowDialog] = useState(false)

    const handleGenerateMnemonicClick = () => {
        const mnemonics = generateMnemonic()
        setMnemonics(mnemonics)
        localStorage.setItem('mnemonic', mnemonics)
    }

    const handleCopyToClipboard = () => {
        navigator.clipboard.writeText(mnemonics)
        toast.success('Copied to Clipboard')
    }

    const handleCreateSolanaWallet = () => {
        const keypair = Wallet.createForSolana(0)
        setSolanaKeypairs([keypair])
        navigate('/sol')
    }

    const handleCreateEthWallet = () => {
        const wallet = Wallet.createForEth(0)
        setEthWallets([wallet])
        navigate('/eth')
    }

    const coins = [
        {
            type: 'Solana',
            handleCreate: handleCreateSolanaWallet,
        },
        {
            type: 'Etherium',
            handleCreate: handleCreateEthWallet,
        },
    ]

    return (
        <>
            <div className="flex flex-col justify-center items-center gap-6 h-screen">
                {!mnemonics ? (
                    <Button onClick={handleGenerateMnemonicClick}>
                        Generate Mnemonic
                    </Button>
                ) : (
                    <div
                        onClick={handleCopyToClipboard}
                        className="flex flex-col gap-4 items-center justify-center border shadow rounded-lg p-4 cursor-pointer max-w-xl w-full"
                    >
                        <ul className="grid grid-cols-3 gap-4 w-full p-4">
                            {mnemonics.split(' ').map((mnemonic, index) => (
                                <li
                                    key={index}
                                    className={
                                        'col-span-1 flex gap-1 items-center justify-start'
                                    }
                                >
                                    <p>{index + 1}.</p>
                                    <p>{mnemonic}</p>
                                </li>
                            ))}
                        </ul>

                        <p className="flex gap-2 items-center text-slate-400">
                            <Copy className="w-5 h-5" /> Click anywhere to copy
                        </p>
                    </div>
                )}
                {mnemonics && (
                    <div className="flex flex-col gap-8 items-center justify-center max-w-xl w-full">
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                checked={checked}
                                onCheckedChange={(val: boolean) =>
                                    setChecked(val)
                                }
                                id="confirmation"
                            />
                            <label
                                htmlFor="confirmation"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                            >
                                I have copied my mnemonics and saved it safely
                            </label>
                        </div>
                        <Button
                            disabled={!checked}
                            className="w-full"
                            onClick={() => setShowDialog(true)}
                        >
                            Create My Wallet <ArrowRight />
                        </Button>
                        <Dialog
                            open={showDialog}
                            onOpenChange={(open) => setShowDialog(open)}
                        >
                            <DialogContent className="max-w-md">
                                <DialogTitle>Create Wallet For</DialogTitle>
                                <div className="flex flex-col gap-3">
                                    {coins.map((coin, index) => (
                                        <div
                                            key={`${coin}-${index}`}
                                            onClick={coin.handleCreate}
                                            className="border rounded p-2 cursor-pointer"
                                        >
                                            {coin.type}
                                        </div>
                                    ))}
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                )}
            </div>
        </>
    )
}
