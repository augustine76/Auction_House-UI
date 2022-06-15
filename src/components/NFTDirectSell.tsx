// import { FC } from 'react';
import { produceWithPatches } from 'immer';
import { FC, useCallback, useState } from 'react';
import React from 'react';
import { useRouter } from "next/router";
import cx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import TextInfoContent from '@mui-treasury/components/content/textInfo';
import { useFourThreeCardMediaStyles } from '@mui-treasury/styles/cardMedia/fourThree';
import { useN04TextInfoContentStyles } from '@mui-treasury/styles/textInfoContent/n04';
import { useOverShadowStyles } from '@mui-treasury/styles/shadow/over';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { sell } from "../api/src/auction-house";
import { useWallet } from '@solana/wallet-adapter-react';
import  axios  from "axios";
const baseURL = "http://localhost:5000"; 
const useStyles = makeStyles(() => ({
    root: {
        maxWidth: 343,
        margin: 'auto',
        borderRadius: 25,
        padding: 12,
    },
    media: {
        borderRadius: 25,
        height: "320px",
        width: "320px",
    },
}));

export const NFTDetails = (props) => {

    
    const router = useRouter()
    const styles = useStyles();
    const mediaStyles = useFourThreeCardMediaStyles();
    const textCardContentStyles = useN04TextInfoContentStyles();
    const shadowStyles = useOverShadowStyles({ inactive: true });
    const mystyles = {
        // "display": "flex",
        // "flexDirection": "row",
        "margin": "25px",
        // "height": "100px"
    }
    const {
        query: { mint, uri },
    } = router

    const pic = async (data) => {
        let uri = await fetch(data);
        let res = await uri.json();
        // console.log("Res", res.image);
        if(!updated){
            setimage(res.image);
            setname(res.name);
            setcollection(res.collection["name"]);
        }
        setupdated(true);
        
    }
    pic(uri);

    const [image, setimage] = useState("")
    const [name, setname] = useState("")
    const [collection, setcollection] = useState("");
    const [updated, setupdated] = useState(false);
    
    const { publicKey } = useWallet();
    const wallet = useWallet();
    let auctionHouseAddress="4kAkuX3eqqb6dFnpbBtbAi9g3tswyAEyns8kDE4nYuvo";
    const [price, setPrice] = useState(''); // '' is the initial state value
    function getSell() {
        console.log("ah,auction",auctionHouseAddress);
         

        sell({ auctionHouse: auctionHouseAddress, buyPrice: price, mint: mint, tokenSize: '1', wallet : wallet }).then(x => {

            alert('Create Sell Action'+'Account'+x.account+'MintAddress'+x.mintAddress+'Price'+x.price);
        })
        const insellnft = { publicKey: publicKey,mintKey:mint };
        axios.post(`${baseURL}/createUser`, insellnft)
          .then(response => console.log("response",response))
          .catch(error => {
            console.error('There was an error!', error);
          });

    }
    console.log("nft details", uri);
    return (
        <div
            style={mystyles}
        >
            <Card className={cx(styles.root, shadowStyles.root)}>
                <CardMedia
                    className={cx(styles.media, mediaStyles.root)}
                image={
                    // props.image
                    image
                }
                />
                <CardContent>
                    <TextInfoContent
                        classes={textCardContentStyles}
                        overline={name}
                        heading={collection}
                    // body={
                    //     props.body
                    // }
                    />
                </CardContent>  
            </Card>
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
                onClick={getSell} disabled={!publicKey}
            >
                <div className="hidden group-disabled:block ">
                    Wallet not connected
                </div>
                <span className="block group-disabled:hidden" >
                   Sell
                </span>
            </button>
        </div>

           

        </div>

    );
};