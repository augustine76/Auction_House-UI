// @ts-nocheck
import { produceWithPatches } from "immer";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Card, Col, Row, Text, Button } from "@nextui-org/react";
import {
  Metaplex,
  bundlrStorage,
  walletAdapterIdentity,
} from "@metaplex-foundation/js-next";
import { Connection, clusterApiUrl, PublicKey } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import { cancel } from "../../../api/src/auction-house"
const axios = require("axios").default;
const baseURL = "http://34.224.215.17:5100";



export const ListedNFTS = (props) => {
  console.log("props", props);
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState('');
  const wallet = useWallet();
  const { publicKey } = useWallet();
  let auctionHouseAddress = "BnHNmwRwMHpjq9LBkvQYTkMGRAY4yuWcT5nnGhVq4SBr";
  const findNft = async (mintKey) => {
    const connection = new Connection(clusterApiUrl("devnet"));

    const metaplex = Metaplex.make(connection)
      //@ts-ignore
      .use(walletAdapterIdentity(wallet))
      .use(bundlrStorage());
    const mint = new PublicKey(mintKey);

    const nft = await metaplex.nfts().findByMint(mint);
    let uri = await fetch(nft.uri);
    let res = await uri.json();
    setName(nft.name);
    setImage(res.image);
    setDescription(res.description);
    axios.get(`${baseURL}/getNFTDetails/${mintKey}`)
      .then(response => {
        console.log("response price", response.data.data.priceAmount)
        setPrice(response.data.data.priceAmount)
      });
  }
  findNft(props.mintKey);
  function cancelListing() {
    console.log("ah,auction", auctionHouseAddress, price, props.mintKey);
    cancel({ auctionHouse: auctionHouseAddress, buyPrice: price, mint: props.mintKey, tokenSize: '1', env: 'devnet', wallet: wallet }).then(x => {
      alert("done")

      const nft = { owner: publicKey, mintKey: props.mintKey };
      axios.post(`${baseURL}/cancelNFTListing`, nft)
        .then(response => {
          console.log("response", response)
          window.location.href = "http://localhost:3000/profile";

        }
        )
        .catch(error => {
          console.error('There was an error!', error);
        });
    })


    // sell({ auctionHouse: auctionHouseAddress, buyPrice: price, mint: props.mintKey, tokenSize: '1', wallet: wallet }).then(x => {

    //     // alert('Create Sell Action' + 'Account' + x.account + 'MintAddress' + x.mintAddress + 'Price' + x.price);
    //     const nft = { owner: publicKey, mintKey: mint, priceAmount: price };
    //     axios.post(`${baseURL}/listNFT`, nft)
    //       .then(response => {
    //         console.log("response", response)
    //         window.location.href = "http://localhost:3000/profile";

    //       }
    //       )
    //       .catch(error => {
    //         console.error('There was an error!', error);
    //       });
    //   })
  }
  return (
    <>
      <Card css={{ w: "100%", h: "300px" }}>
        <Card.Header css={{ position: "absolute", zIndex: 1, top: 0 }}>
          <Col></Col>
        </Card.Header>
        <Card.Body css={{ p: 0 }}>
          <Card.Image
            src={image}
            width="100%"
            height="100%"
            objectFit="cover"
            alt="Card example background"
          />
        </Card.Body>
        <Card.Footer
          css={{
            background: "#181818",
            borderTop: "$borderWeights$light solid rgba(255, 255, 255, 0.2)",
            bottom: 0,
            zIndex: 1,
          }}
        >
          <Row>
            <Col
              css={{
                padding: "10px 0",
              }}
            >
              <Text
                css={{ w: "100%" }}
                size={12}
                weight="bold"
                transform="uppercase"
                color="#fff"
              >
                {name}
              </Text>
              <Text color="#fff">Price:{props.price}</Text>
              <Text color="#fff" size={12}>
                {description}
              </Text>
              <Button size="sm" color="gradient" onClick={cancelListing} css={{ margin: "auto" }}>
                <span className="block group-disabled:hidden ">Cancel Listing</span>
              </Button>
            </Col>
          </Row>
        </Card.Footer>
      </Card>
    </>
  );
};
