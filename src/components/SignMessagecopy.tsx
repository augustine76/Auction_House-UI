// TODO: SignMessage

import { FC, useCallback, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { clusterApiUrl } from '@solana/web3.js'
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets'
import { Connection } from '@solana/web3.js';
import { actions } from "@metaplex/js";
const { mintNFT } = actions;
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { useSession, signIn } from 'next-auth/react';

export const SignMessage2: FC = () => {
    const { data: session } = useSession()
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

    async function fetchNonce() {
    
        const response = await fetch('api/login');
      
        if(response.status != 200)
          throw new Error("nonce could not be retrieved");
    
        const { nonce } = await response.json();
        
        return nonce;
      }

    const login = async (req, res) => {

        const nonce = await fetchNonce();

        const message = `Sign this message for authenticating with your wallet. Nonce: ${nonce}`;
        const encodedMessage = new TextEncoder().encode(message);
        const signedMessage = await solana.request({
          method: "signMessage",
          params: {
            message: encodedMessage,
          },
        });

        signIn('credentials',
      { 
        redirect: false,
        publicKey: signedMessage.publicKey,
        signature: signedMessage.signature,
        synchronize: false
        // callbackUrl: `${window.location.origin}`
      }
    )
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
                onClick={login} disabled={!publicKey}
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
