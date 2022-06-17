import {setAndVerifyCollectionAll} from "./commands/mint-nft";
import { loadWalletKey } from './helpers/accounts';
import { web3 } from '@project-serum/anchor';
import { PublicKey } from '@solana/web3.js';
import { getCluster } from './helpers/various';
import * as fs from 'fs';

  export const verifyMultipleNfts = async(cmd) =>{

    const { wallet, env, hashlist, collectionMint, rpcUrl, rateLimit } =
      cmd.opts();
    const collectionMintKey = new PublicKey(collectionMint);
    const solConnection = new web3.Connection(rpcUrl || getCluster(env));
    

    const mintList: string[] = JSON.parse(fs.readFileSync(hashlist, 'utf-8'));
    await setAndVerifyCollectionAll(
      mintList,
      solConnection,
      wallet,
      collectionMintKey,
      rateLimit,
    );
  };
