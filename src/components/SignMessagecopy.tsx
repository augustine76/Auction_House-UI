// TODO: SignMessage

import { FC, useCallback, useState } from 'react';
import { notify } from "../utils/notifications";
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { clusterApiUrl } from '@solana/web3.js'
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets'
import { Connection } from '@solana/web3.js';
import { actions } from "@metaplex/js";
const { mintNFT } = actions;
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';



export const SignMessage2: FC = () => {
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
    const onClick = async () => {
        try {

            
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

            const urlencoded = new URLSearchParams();
            urlencoded.append("url", "URI");

            //@ts-ignore
            const requestOptions = {
                method: 'POST',
                mode : "no-cors",
                headers: myHeaders,
                body: urlencoded,
                redirect: 'follow'
            };
            //@ts-ignore
           const uri =  fetch("http://localhost:5000/createNft", requestOptions)

            // console.log(nft);
        }
        catch (err) {
            console.log(err)
        }
    }

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
                    Create NFTS for test wallet
                </span>
            </button>
        </div>
    );
};
