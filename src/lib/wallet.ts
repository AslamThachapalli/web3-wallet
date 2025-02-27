import { mnemonicToSeedSync } from 'bip39';
import slip10 from 'micro-key-producer/slip10.js';
import { Keypair } from '@solana/web3.js';
import { DerivationPath } from './utils';
import { Wallet as EthWallet, HDNodeWallet } from 'ethers';

export class Wallet {
    static createForSolana(account: number): Keypair {
        const mnemonics = localStorage.getItem('mnemonic');
        if (!mnemonics) {
            throw Error('No mnemonic found!');
        }
        const seed = mnemonicToSeedSync(mnemonics);
        const hdkey = slip10.fromMasterSeed(seed.toString('hex'));

        const keyPair = Keypair.fromSeed(
            hdkey.derive(DerivationPath.solana(account)).privateKey,
        );
        return keyPair;
    }

    static createForEth(account: number): EthWallet {
        const mnemonics = localStorage.getItem('mnemonic');
        if (!mnemonics) {
            throw Error('No mnemonic found!');
        }
        const seed = mnemonicToSeedSync(mnemonics);
        const hdNode = HDNodeWallet.fromSeed(seed);
        const child = hdNode.derivePath(DerivationPath.etherium(account));
        const privateKey = child.privateKey;
        const wallet = new EthWallet(privateKey);
        return wallet;
    }

    static async getBalanceEth(publicKey: string): Promise<number> {
        const res = await fetch(
            'https://eth-mainnet.g.alchemy.com/v2/P4G854hHX1l69UZRRfDQeOq9dTjqrnsZ',
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

    static async getBalanceSol(publicKey: string): Promise<number> {
        const res = await fetch(
            'https://solana-mainnet.g.alchemy.com/v2/P4G854hHX1l69UZRRfDQeOq9dTjqrnsZ',
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
