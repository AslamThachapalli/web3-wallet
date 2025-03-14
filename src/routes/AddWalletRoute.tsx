import { SelectionCard } from '@/components/addWallet/SelectionCard';
import { Button } from '@/components/ui/button';
import { Download, Plus, X } from 'lucide-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';

export default function AddWalletRoute() {
    const navigate = useNavigate();

    useEffect(() => {
        // const accounts = JSON.parse(
        //     localStorage.getItem('accounts') || '[]',
        // );
        // if (accounts && accounts.length > 0) {
        //     navigate('/accounts');
        // }
    }, []);

    const handleClose = ( ) => {
        navigate(-1)
    }

    return (
        <div className="flex flex-col justify-between h-full text-white">
            <div className="flex items-center border-b-2 p-4">
                <X className="cursor-pointer" onClick={handleClose}/>
                <p className="font-semibold flex-grow flex justify-center">
                    Add / Connect Wallet
                </p>
            </div>
            <div className="h-full p-4 flex flex-col gap-4">
                <SelectionCard
                    icon={<Plus />}
                    title="Create New Account"
                    onClick={() => {
                        navigate('/new-account');
                    }}
                />
                <SelectionCard
                    icon={<Download />}
                    title="Import Private Key"
                    onClick={() => {}}
                />
            </div>
            <div className="flex items-center border-t-2 p-4">
                <Button className="w-full" onClick={handleClose}>Close</Button>
            </div>
        </div>
    );
}
