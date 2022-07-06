// @ts-nocheck
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
import { sell } from "../../api/src/auction-house";
import { useWallet } from '@solana/wallet-adapter-react';
import { Input, Container, Row, Col, Textarea, Button } from "@nextui-org/react";
import axios from "axios";

const baseURL = "https://powerful-coast-99873.herokuapp.com";
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
        query: { mint, image, name },
    } = router


    const [collection, setcollection] = useState("");
    const [updated, setupdated] = useState(false);

    const { publicKey } = useWallet();
    const wallet = useWallet();
    let auctionHouseAddress = "BnHNmwRwMHpjq9LBkvQYTkMGRAY4yuWcT5nnGhVq4SBr";
    const [price, setPrice] = useState(''); // '' is the initial state value
    function getSell() {
        console.log("ah,auction", auctionHouseAddress);

        sell({ auctionHouse: auctionHouseAddress, buyPrice: price, mint: mint, tokenSize: '1', wallet: wallet }).then(x => {

            alert('Create Sell Action' + 'Account' + x.account + 'MintAddress' + x.mintAddress + 'Price' + x.price);
            const nft = { owner: publicKey, mintKey: mint, priceAmount: price };
            axios.post(`${baseURL}/listNFT`, nft)
            .then(response => {console.log("response", response)
            window.location.href = "http://localhost:3000/profile";
           
        }
            )
            .catch(error => {
                console.error('There was an error!', error);
            });
        })
        

    }
    // console.log("nft details", uri);
    return (
        <div
            style={mystyles}
        >
            <Card className={cx(styles.root, shadowStyles.root)}>
                <CardMedia
                    className={cx(styles.media, mediaStyles.root)}
                    image={
                        image
                    }
                />
                <CardContent>
                    <TextInfoContent
                        classes={textCardContentStyles}
                        overline={name}
                        heading={collection}
                    body={
                        name
                    }
                    />
                </CardContent>
            </Card>
            <div>
               <br/>
                <Row
          gap={1}
          css={{ padding: "30px 0" }}
          justify="center"
          align="center"
        >
          <Col span={3}>
            <Input
              css={{ w: "100%" }}
              
              labelPlaceholder="Price"
              color="primary"
              size="lg"
              clearable
              underlined
              onChange={(e) => { setPrice(e.target.value) }}
            />
          </Col>
        </Row>
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