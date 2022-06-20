import { useWallet } from '@solana/wallet-adapter-react';
import { FC, useCallback, useState } from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
// import { verifyMultipleNfts } from '../api/src/verify';
// import {verifyMultipleNfts } from "../api/src/verify"




// import  FilePicker  from 'react-file-picker'
 
export const FilePicker = () => {
  // <FilePicker
  //   extensions={['md']}
  //   onChange={FileObject =>console.log(FileObject)}
  //   onError={errMsg => console.log(errMsg)}
  // >
  //   <button>
  //     Click to upload markdown
  //   </button>
  // </FilePicker>
  const [hash, setHash] = useState(null);
  const [createObjectURL, setCreateObjectURL] = useState(null);
  const uploadToClient = (event) => {
    if (event.target.files && event.target.files[0]) {
      const i = event.target.files[0];
      setHash(i);
      setCreateObjectURL(URL.createObjectURL(i));
    }
  };
  const uploadToServer = async () => {
    console.log("url is", createObjectURL);
    let res = await fetch(createObjectURL);
    let data = await res.json();
    console.log("json is", data);

  }

  return (
    <>
      <input type="file" name="myImage" onChange={uploadToClient} />
          <button
          className="btn btn-primary"
          type="submit"
          onClick={uploadToServer}
      >
        Send to server
      </button>
    </>
  )
}

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
            <FilePicker/>
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
