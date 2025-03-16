import { HDNodeWallet , Wallet} from "ethers";
import { DerivationPath} from "./utils";

export class Ethereum {
    static createWallet(account: number) {
        const seed = localStorage.getItem('seed');
        if (!seed) {
            throw Error('No seed found!');
        }
        const hdNode = HDNodeWallet.fromSeed(Buffer.from(seed, 'hex'));
        const child = hdNode.derivePath(DerivationPath.etherium(account));
        const privateKey = child.privateKey;
        const wallet = new Wallet(privateKey);
        return wallet;
    }

    static async getBalance(publicKey: string): Promise<number> {
        const res = await fetch(
            'https://eth-sepolia.g.alchemy.com/v2/P4G854hHX1l69UZRRfDQeOq9dTjqrnsZ',
            {
                method: 'POST',
                body: JSON.stringify({
                    jsonrpc: '2.0',
                    id: 1,
                    method: 'eth_getBalance',
                    params: [publicKey, 'latest'],
                }),
            },
        );

        const resJson = await res.json();

        const balance = resJson.result;
        return Number(balance) / Math.pow(10, 18);
    }
}