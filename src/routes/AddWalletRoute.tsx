import { Button } from '@/components/ui/button';
import { Download, Plus, X } from 'lucide-react';
import { useNavigate } from 'react-router';

export default function AddWalletRoute() {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col justify-between h-full text-white">
            <div className="flex items-center border-b-2 p-4">
                <X className="cursor-pointer" />
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
                <Button className="w-full">Close</Button>
            </div>
        </div>
    );
}

interface SelectionCardProps {
    icon: React.ReactNode;
    title: string;
    onClick: () => void;
}

function SelectionCard(props: SelectionCardProps) {
    return (
        <div
            className="bg-gray-500 rounded-lg p-4 cursor-pointer flex items-center gap-4"
            onClick={props.onClick}
        >
            <div className="p-1 rounded-full bg-gray-400">{props.icon}</div>
            <p className="font-semibold">{props.title}</p>
        </div>
    );
}
