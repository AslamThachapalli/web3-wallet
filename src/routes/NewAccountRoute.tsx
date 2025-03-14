import { AddAccount } from '@/components/newAccount/AddAccount';
import { GenerateMnemonic } from '@/components/newAccount/GenerateMnemonic';
import { useEffect, useState } from 'react';

export default function NewAccountRoute() {
    const [isInitial, setIsInitial] = useState(true);

    useEffect(() => {
        const seed = localStorage.getItem('seed');

        if (seed) {
            setIsInitial(false);
        }
    }, []);

    return isInitial ? <GenerateMnemonic /> : <AddAccount />;
}
