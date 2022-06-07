// TODO: SignMessage

import { FC, useCallback, useState } from 'react';
import { notify } from "../utils/notifications";
import {  useWallet } from '@solana/wallet-adapter-react'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { clusterApiUrl } from '@solana/web3.js'
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets'
import { Connection } from '@solana/web3.js';
import { actions } from "@metaplex/js";
const { mintNFT } = actions;
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';

export const SignMessage: FC = () => {
    const network = WalletAdapterNetwork.Devnet;
    const wallets = [
        new PhantomWalletAdapter(),
        new SolflareWalletAdapter({ network }),
    ];
    const endpoint = clusterApiUrl(network);

    const connection = new Connection(endpoint);
    const { publicKey, signMessage } = useWallet();
    const [URI, setURI] = useState("");

    const wallet = useWallet();
    const onClick = useCallback(async () => {
        try {
            alert("MetaData Field should contain a creator address same as the minter");
            const nft =  await mintNFT({ connection, wallet :  wallet, uri : URI,})

            console.log(nft);
        } 
        catch (err) {
            console.log(err)
        }
    }, [publicKey, notify, signMessage]);

    return (
        <div>
            <Box
                component="form"
                sx={{
                    '& > :not(style)': { m: 2, width: '25ch' },
                    input: {
                        background: "white"
                    }
                }}
                noValidate
                autoComplete="off"
            >
                <TextField
                    label="URI"
                    variant='filled'
                    color='success'
                    onChange={(e) => { setURI(e.target.value) }}
                    size='small'
                />
            </Box>
            <button
                className="group w-60 m-2 btn animate-pulse disabled:animate-none bg-gradient-to-r from-[#9945FF] to-[#14F195] hover:from-pink-500 hover:to-yellow-500 ... "
                onClick={onClick} disabled={!publicKey}
            >
                <div className="hidden group-disabled:block">
                    Wallet not connected
                </div>
                <span className="block group-disabled:hidden" >
                    Create NFTS From wallet
                </span>
            </button>
        </div>
    );
};
