import React, { useEffect, useState } from "react";
import { Grid, Container, Row } from "@nextui-org/react";
import { Collections } from "../Collections";
import { useWallet } from "@solana/wallet-adapter-react";
const axios = require("axios").default;
const truncate = (str, n) => {
  return str?.length > n ? str.substr(0, n - 1) + "..." : str;
};
import {
  Metaplex,
  bundlrStorage,
  walletAdapterIdentity,
} from "@metaplex-foundation/js-next";
import { Connection, clusterApiUrl,PublicKey } from "@solana/web3.js";

const baseURL = "http://localhost:5000";

let collectionNames = [];

export const UserNFT = (props: any) => {
  let res = [];
  let Ikey = 0;
  const [NFTList, setNFTList] = useState([]);
  const [updated, setupdated] = useState(false);
  console.log("props", props)
  const { publicKey } = useWallet();

  const getCollections = async () => {
    try {
      console.log("abc", publicKey.toBase58())
      const owner=publicKey.toBase58()
      const response = await axios.post(`${baseURL}/FetchCollectionsByAddress`, { owner: owner })
        .then(res => { 
          // console.log("res data is", res.data.data[0].collectionName)
          return res.data;
          // res.map(x => {
          //   if(collectionNames.indexOf(x.collectionName) == -1){
          //       collectionNames.push(x.collectionName);
          //   }
          // })
        });
      console.log("collectionList", res);
        
      // const response = await axios(
      //   "https://api-mainnet.magiceden.dev/v2/collections?offset=0&limit=30"
      // );
      console.log("Inside Fetch2", response);
      return response;
      response.map(x => {
        if(collectionNames.indexOf(x.collectionName) == -1){
            collectionNames.push(x.collectionName);
        }
      });
      console.log("collectionNames", collectionNames);
      return collectionNames;
    } catch (error) {
      console.log("ERROR", error);
    }
  };

  const fetchedNft = async () => {
    res = await getCollections();
    res.map(x => {
      if(collectionNames.indexOf(x.collectionName) == -1){
          collectionNames.push(x.collectionName);
      }
    });
    console.log("collection list 2", collectionNames);
    console.log("res", res)
    setupdated(true);
    setNFTList(res);
    console.log("collection", NFTList);
  };

  useEffect(() => {
    fetchedNft();
  }, []);
  const [image, setImage] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('')
  const findNft = async (mintKey) => {
    const connection = new Connection(clusterApiUrl("devnet"));
        const { publicKey } = useWallet();
        const wallet = useWallet();
        const metaplex = Metaplex.make(connection)
            //@ts-ignore
            .use(walletAdapterIdentity(wallet))
            .use(bundlrStorage());
            const mint = new PublicKey(mintKey);

            const nft = await metaplex.nfts().findByMint(mint);
            console.log("nftdata",nft.uri)
            let uri = await fetch(nft.uri);
            let res = await uri.json();
            console.log("image",res.image)
            console.log("name",nft.name)
            console.log("collection",nft)
            console.log("des",res.description);
            setName(nft.name)
            setImage(res.image)
            setDescription(res.description)
  
  }
  return (
    <div>
      <Container gap={0}>
        <p>{props.type}</p>
        <Row gap={0}>
          <Grid.Container gap={2} justify="center">
            {
            updated ?
              collectionNames.map((x) => {
                return (
                  <h1>{x}</h1>
                  )
              })
              :
              <></>

            }
            {/* {updated ? NFTList.map((x) => {
              findNft(x.mintKey)
              
              return (
                <Grid xs={12} md={2} lg={2}>
                  <Collections
                    name={name}
                    collection={x.collectionName}
                    image={image}
                    key={Ikey++}
                    body={description}
                  />
                </Grid>
              );
            }) : "not Updated"} */}
          </Grid.Container>
        </Row>
      </Container>
    </div>
  );
};
