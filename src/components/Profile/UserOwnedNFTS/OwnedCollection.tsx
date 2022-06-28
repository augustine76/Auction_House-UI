import React, { useEffect, useState } from "react";
import { Grid, Container, Row } from "@nextui-org/react";
import { Collections } from "../../Collections";
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
import { Connection, clusterApiUrl, PublicKey } from "@solana/web3.js";
import { UserOwnedNFTs } from "./OwnedNFTs"
const baseURL = "http://localhost:5000";

let collectionNames = [];

export const UserOwnedCollection = (props: any) => {
  let res = [];
  let Ikey = 0;
  const [NFTList, setNFTList] = useState([]);
  const [updated, setupdated] = useState(false);
  console.log("props", props)
  const { publicKey } = useWallet();

  const getCollections = async () => {
    try {
      console.log("abc", publicKey.toBase58())
      const owner = publicKey.toBase58()
      const response = await axios.post(`${baseURL}/FetchCollectionsByAddress`, { owner: owner,inSale:false })
        .then(res => {
          return res.data;
          
        });
      
      return response;
     
    } catch (error) {
      console.log("ERROR", error);
    }
  };

  const fetchedNft = async () => {
    res = await getCollections();
    
      res.map(x => {
        if (collectionNames.indexOf(x.collectionName) == -1) {
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
  
  return (
    <div>
      <Container gap={0}>
        <p>{props.type}</p>
        <Row gap={0}>
          <Grid.Container gap={2} justify="center">
            {
              updated && collectionNames ?
                collectionNames.map((x) => {
                  return (
                    <div>
                      <h1>{x}</h1>

                      <UserOwnedNFTs data={x} />
                    </div>

                  )
                })
                :
                "not Updated"

            }
           
          </Grid.Container>
        </Row>
      </Container>
    </div>
  );
};
