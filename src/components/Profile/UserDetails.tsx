
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
import axios from 'axios';
import Link from "next/link";

// import { signIn, signOut, useSession } from 'next-auth/client';
const baseURL = "http://localhost:5000";
export const UserDetails = () => {



  const [issignin, setIssignin] = useState(false);
  // const [session] = useSession();
  const network = WalletAdapterNetwork.Devnet;
  const wallets = [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter({ network }),
  ];
  const endpoint = clusterApiUrl(network);
  const [pubkey, setPubkey] = useState("");
  const connection = new Connection(endpoint);
  const { publicKey, signMessage } = useWallet();
  const [displayName, setDisplayName] = useState("");
  const [userName, setUserName] = useState("");

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
    try {


      const user = { publicKey: publicKey, signature: signedMessage.signature };
      axios.post(`${baseURL}/createUser`, user)
        .then(response => console.log(response))
        .catch(error => {
          console.error('There was an error!', error);
        });

      axios.get(`${baseURL}/getUserDetails/${publicKey}`)
        .then(response => {
          console.log("user details", response)
          console.log("pub key", response.data.data.publicKey)
          setPubkey(response.data.data.publicKey);
          if (response.data.data.userName) {
            setUserName(response.data.data.userName)
          }
          if (response.data.data.displayName) {
            setDisplayName(response.data.data.displayName)
          }

        }

        )
        .catch(error => {
          console.error('There was an error!', error);
        });

    }
    catch (err) {
      console.log(err)
    }
  }
  const getSignout = async () => {
    signOut();
    setIssignin(false);
  }

  return (
    <div>



      {issignin ? <>
        <img src="https://gateway.pinata.cloud/ipfs/QmQ9QiGncY4J8gexqKNA77Du7FSBdbGURR4PWoP7wn8A11" className="profileimg" />
        <div className="profileName">{displayName}</div>
        <div className="profileNameB text-center text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-tr from-[#9945FF] to-[#14F195]">{userName}</div>
        <div className="publicKey">{pubkey}</div>
        <button className="pd group w-60 m-2 btn animate-pulse disabled:animate-none bg-gradient-to-r from-[#9945FF] to-[#14F195] hover:from-pink-500 hover:to-yellow-500 ... "            >
          <span className="block group-disabled:hidden ">Edit Profile</span>
        </button>        
        {/* <Link href="/collectionForm">
              <a className="btn btn-ghost btn-sm rounded-btn">Add Collection</a>
            </Link> */}
            <Link 
                href={{
                        pathname: "/collectionForm",
                        query: { pubkey: pubkey }, //pubkey not available here now due to CORS
                      }}
                       
            ><a   className="btn btn-ghost btn-sm rounded-btn">Add Collection</a></Link>

        {/* <div className="box">
          <a href="#m1-o" className="link-1" id="m1-c">Modal 1</a>
          

          <div className="modal-container" id="m1-o" >
            <div className="modal">
              <h1 className="modal__title">Modal 1 Title</h1>
              <p className="modal__text">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis ex dicta maiores libero minus obcaecati iste optio, eius labore repellendus.</p>
              <button className="modal__btn">Button &rarr;</button>
              <a href="#m1-c" className="link-2"></a>
            </div>
          </div>
        </div> */}



        <br />
        <button onClick={getSignout} className="pd group w-60 m-2 btn animate-pulse disabled:animate-none bg-gradient-to-r from-[#9945FF] to-[#14F195] hover:from-pink-500 hover:to-yellow-500 ... "            >
          <span className="block group-disabled:hidden ">Sign Out</span>
        </button>
      </> :



        <>
          <img src="https://gateway.pinata.cloud/ipfs/QmQ9QiGncY4J8gexqKNA77Du7FSBdbGURR4PWoP7wn8A11" className=" profileimg" />
          {<button onClick={getSignIn} className="pd group w-60 m-2 btn animate-pulse disabled:animate-none bg-gradient-to-r from-[#9945FF] to-[#14F195] hover:from-pink-500 hover:to-yellow-500 m-4 ... "            >
            <span className="block group-disabled:hidden ">Sign In</span>
          </button>
          }
        </>
      }

    </div>

  );
};
