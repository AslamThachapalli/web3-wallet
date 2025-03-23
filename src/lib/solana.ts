import { Connection, PublicKey, Keypair } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { DerivationPath } from './utils';
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

    static async getAllTokenAccounts(publicKey: string) {
        const connection = new Connection(
            `https://solana-devnet.g.alchemy.com/v2/${import.meta.env.VITE_ALCHEMY_API_KEY}`,
        );

        const owner = new PublicKey(publicKey);
        let response = await connection.getParsedTokenAccountsByOwner(owner, {
            programId: TOKEN_PROGRAM_ID,
        });

        let tokenAccounts: any[] = [];

        response.value.forEach((accountInfo) => {
            const mint = accountInfo.account.data['parsed']['info']['mint'];
            const amount = accountInfo.account.data['parsed']['info']['tokenAmount']['amount'];
            const decimals = accountInfo.account.data['parsed']['info']['tokenAmount']['decimals'];

            tokenAccounts.push({
                name: 'Unknown Token',
                pubkey: accountInfo.pubkey.toBase58(),
                mint: mint,
                amount: amount,
                decimals: decimals,
                balance: amount / Math.pow(10, decimals),
                symbol: 'TOKEN',
            });
          });

        return tokenAccounts;
    }
}
