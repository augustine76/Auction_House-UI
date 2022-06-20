import { useWallet } from '@solana/wallet-adapter-react';
import { FC, useCallback, useState } from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';

import { buy } from "../api/src/auction-house";


export const Buy: FC = () => {
    
    const { publicKey } = useWallet();
    const [price, setPrice] = useState(''); 
    const [mintAddress, setMintAddress] = useState('');
    const [auctionHouseAddress,setAuctionHouseAddress]= useState('');
    
    const wallet = useWallet();
  
    function getBuy() {
        buy({ auctionHouse: auctionHouseAddress, buyPrice: price, tokenSize: '1', mint: mintAddress, env: 'devnet', wallet: wallet,sellerWallet : '3xHQ23yToCpMPWrEm2KuwLXH5aY9JM8Sy1vyA7X1ekwV' }).then(x => {
            alert('Buy / offer Action'+'Offer: '+x);
        })
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
            <TextField 
                label="Auction House Address"
                variant='filled'
                color='success'
                text-color="red"
                onChange={(e) => { setAuctionHouseAddress(e.target.value)}}
                size='small'
            />
                        <TextField 
                label="Mint Address"
                variant='filled'
                color='success'
                text-color="red"
                onChange={(e) => { setMintAddress(e.target.value)}}
                size='small'
            />
                        <TextField 
                label="Price"
                variant='filled'
                color='success'
                text-color="red"
                onChange={(e) => { setPrice(e.target.value)}}
                size='small'
            />
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
