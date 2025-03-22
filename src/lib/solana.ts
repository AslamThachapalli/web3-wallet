import { Keypair } from "@solana/web3.js";
import { DerivationPath } from "./utils";
import slip10 from 'micro-key-producer/slip10.js';

export class Solana {
    static createWallet(account: number) {
        const seed = localStorage.getItem('seed');
        if (!seed) {
            throw Error('No seed found!');
        }
        const hdkey = slip10.fromMasterSeed(seed);

        const keyPair = Keypair.fromSeed(
            hdkey.derive(DerivationPath.solana(account)).privateKey,
        );
        return keyPair;
    }

    static createWalletFromPrivateKey(key: number[]) {
        const keyPair = Keypair.fromSecretKey(Uint8Array.from(key));
        return keyPair;
    }

    static async getBalance(publicKey: string): Promise<number> {
        const res = await fetch(
            `https://solana-devnet.g.alchemy.com/v2/${import.meta.env.VITE_ALCHEMY_API_KEY}`,
            {
                method: 'POST',
                body: JSON.stringify({
                    jsonrpc: '2.0',
                    id: 1,
                    method: 'getBalance',
                    params: [publicKey],
                }),
            },
        );

        const resJson = await res.json();

        const balance = resJson.result.value;
        return balance / Math.pow(10, 9);
    }
}