
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
import { signIn, signOut, useSession } from 'next-auth/react';
// import { signIn, signOut, useSession } from 'next-auth/client';

export const UserDetails = () => {
  const [issignin, setIssignin] = useState(false);
  // const [session] = useSession();
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

    if (response.status != 200)
      throw new Error("nonce could not be retrieved");

    const { nonce } = await response.json();

    return nonce;
  }

  const getSignIn = async () => {

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
        signature: signedMessage.signature
      }
   
    )
    setIssignin(true);
  }
  const getSignout= async ()=>{
    signOut();
    setIssignin(false);
  }

  return (
    <div>
      

        
          { issignin? <>
          <img src="https://gateway.pinata.cloud/ipfs/QmQ9QiGncY4J8gexqKNA77Du7FSBdbGURR4PWoP7wn8A11" className="profileimg" />
          <div className="profileName">Isha</div>
          <div className="profileNameB text-center text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-tr from-[#9945FF] to-[#14F195]">@Isha</div>
          <div className="publicKey">DZMj6Bf2qw5RRZjqKzyajd</div>
          <button className="pd group w-60 m-2 btn animate-pulse disabled:animate-none bg-gradient-to-r from-[#9945FF] to-[#14F195] hover:from-pink-500 hover:to-yellow-500 ... "            >
            <span className="block group-disabled:hidden ">Edit Profile</span>
          </button>
          <button onClick={getSignout} className="pd group w-60 m-2 btn animate-pulse disabled:animate-none bg-gradient-to-r from-[#9945FF] to-[#14F195] hover:from-pink-500 hover:to-yellow-500 ... "            >
            <span className="block group-disabled:hidden ">Sign Out</span>
          </button>
           </>:
          
       
      
      <>
        <img src="https://gateway.pinata.cloud/ipfs/QmQ9QiGncY4J8gexqKNA77Du7FSBdbGURR4PWoP7wn8A11" className="profileimg" />
        { <button onClick={getSignIn} className="pd group w-60 m-2 btn animate-pulse disabled:animate-none bg-gradient-to-r from-[#9945FF] to-[#14F195] hover:from-pink-500 hover:to-yellow-500 m-4 ... "            >
          <span className="block group-disabled:hidden ">Sign In</span>
        </button>
        }
      </>
}

    </div>

  );
};
