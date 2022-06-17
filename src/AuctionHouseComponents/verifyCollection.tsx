import { useWallet } from '@solana/wallet-adapter-react';
import { FC, useCallback, useState } from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
// import { verifyMultipleNfts } from '../api/src/verify';
// import {verifyMultipleNfts } from "../api/src/verify"




// import { FilePicker } from 'react-file-picker'
 
// const MyComponent = () => (
//   <FilePicker
//     extensions={['md']}
//     onChange={FileObject =>console.log(FileObject)}
//     onError={errMsg => console.log(errMsg)}
//   >
//     <button>
//       Click to upload markdown
//     </button>
//   </FilePicker>
// )

export const Verify: FC = () => {
    
    const { publicKey } = useWallet();
    const [price, setPrice] = useState(''); 
    const [mintAddress, setMintAddress] = useState('');
    const [auctionHouseAddress,setAuctionHouseAddress]= useState('');
    
    const wallet = useWallet();
  
    function verifyCollection() {
        // verifyMultipleNfts({wallet,env: 'devnet',})
    }
    
    return (
        <div>
            {/* <MyComponent/> */}
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
                onClick={verifyCollection} disabled={!publicKey}
            >
                <div className="hidden group-disabled:block ">
                    Wallet not connected
                </div>
                <span className="block group-disabled:hidden" >
                   Verify
                </span>
            </button>
        </div>
    );
};
