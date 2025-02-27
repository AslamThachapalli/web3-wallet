import { Keypair } from '@solana/web3.js';

export default function SolanaWallets({ keypair }: { keypair: Keypair | null }) {
    if(!keypair){
        return <>No Wallet</>
    }

    return <>{keypair.publicKey.toBase58()}</>;
}
