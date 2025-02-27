import { Wallet } from 'ethers';

export default function EthWallets({ wallet }: { wallet: Wallet | null }) {
    if (!wallet) {
        return <>No Wallet</>;
    }
    return <>{wallet.address}</>;
}
