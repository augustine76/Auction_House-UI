// @ts-nocheck
import { useWallet } from '@solana/wallet-adapter-react';
import { FC, useCallback, useState } from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { useRouter } from "next/router";
import { buy } from "../../api/src/auction-house";
import axios from "axios";
const baseURL = "http://34.224.215.17:5100";

export const Buy: FC = () => {
    const router = useRouter()
    const {
        query: { mint },
    } = router

    const { publicKey } = useWallet();
    
    const [mintAddress, setMintAddress] = useState('');
    let auctionHouseAddress="4kAkuX3eqqb6dFnpbBtbAi9g3tswyAEyns8kDE4nYuvo";
    const [price, setPrice] = useState(''); 
    const [sellerWallet, setSellerWallet] = useState(''); 
    const wallet = useWallet();
  
    function getBuy() {
        axios.get(`${baseURL}/getNFTDetails/${mint}`)
        .then(response => {
          console.log("user details", response)
          console.log("pub key", response.data.data.owner)
          setPrice(response.data.data.priceAmount);
          setSellerWallet(response.data.data.owner)
          
        }

        )
        .catch(error => {
          console.error('There was an error!', error);
        });
        // buy({ auctionHouse: auctionHouseAddress, buyPrice: price, tokenSize: '1', mint: mint, env: 'devnet', wallet: wallet }).then(x => {
        //     alert('Buy / offer Action'+'Offer: '+x);
        // })
        console.log("mintkey",mint)
        console.log("seller",sellerWallet)
        let res = buy({ auctionHouse: auctionHouseAddress, buyPrice: price, tokenSize: '1', mint: mint, env: 'devnet', wallet: wallet,sellerWallet : sellerWallet }).then(x => {
            alert('Buy / offer Action'+'Offer: '+x);
        });
        console.log("txid res",res);
        // const buyer = { buyer: publicKey  };
    //   axios.post(`${baseURL}/buy`, buyer)
    //     .then(response => console.log(response))
    //     .catch(error => {
    //       console.error('There was an error!', error);
    //     });
    }
    
    return (
        <div>
            <Box
                component="form"
      sx={{
        '& > :not(style)': { m: 2, width: '25ch' },
        input:{
            background: "white"
        }
      }}
      noValidate
      autoComplete="off"
    >
            {/* <TextField 
                label="Auction House Address"
                variant='filled'
                color='success'
                text-color="red"
                onChange={(e) => { setAuctionHouseAddress(e.target.value)}}
                size='small'
            /> */}
                        {/* <TextField 
                label="Mint Address"
                variant='filled'
                color='success'
                text-color="red"
                onChange={(e) => { setMintAddress(e.target.value)}}
                size='small'
            /> */}
                        {/* <TextField 
                label="Price"
                variant='filled'
                color='success'
                text-color="red"
                onChange={(e) => { setPrice(e.target.value)}}
                size='small'
            /> */}
    </Box>
    <button
                className="group w-60 m-2 btn animate-pulse disabled:animate-none bg-gradient-to-r from-[#9945FF] to-[#14F195] hover:from-pink-500 hover:to-yellow-500 ... "
                onClick={getBuy} disabled={!publicKey}
            >
                <div className="hidden group-disabled:block ">
                    Wallet not connected
                </div>
                <span className="block group-disabled:hidden" >
                   Buy
                </span>
            </button>
        </div>
    );
};
