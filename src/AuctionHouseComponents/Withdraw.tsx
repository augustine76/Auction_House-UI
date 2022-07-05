// @ts-nocheck
import { useWallet } from '@solana/wallet-adapter-react';
import { FC, useCallback, useState } from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';


import { withdraw} from "../api/src/auction-house";

export const Withdraw: FC = () => {
    let walletAddress = "";
    const [price, setPrice] = useState(''); // '' is the initial state value
    const [auctionHouseAddress,setAuctionHouseAddress]= useState(''); // '' is the initial state value
    

    const { publicKey } = useWallet();
    const wallet = useWallet();

    function getWithdraw() {
        withdraw({ auctionHouse: auctionHouseAddress, amount: price, env: 'devnet', wallet: wallet })
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
                onChange={(e) => { setAuctionHouseAddress(e.target.value)}}
                size='small'
            />
                <TextField 
                label="Withdraw Value"
                variant='filled'
                color='success'
                onChange={(e) => { setPrice(e.target.value)}}
                size='small'
            />

    </Box>

            
            <button
                className="group w-60 m-2 btn animate-pulse disabled:animate-none bg-gradient-to-r from-[#9945FF] to-[#14F195] hover:from-pink-500 hover:to-yellow-500 ... "
                onClick={getWithdraw} disabled={!publicKey}
            >
                <div className="hidden group-disabled:block ">
                    Wallet not connected
                </div>
                <span className="block group-disabled:hidden" >
                    Withdraw 
                </span>
            </button>
            
        </div>
    );
};
