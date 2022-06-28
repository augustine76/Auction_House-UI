import React, { useEffect, useState } from "react";
import { Grid, Container, Row, Col } from "@nextui-org/react";
// import { Collections } from "../../Collections";
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
import { UserListedNFTs } from "./UserListedNFTs";
const baseURL = "http://localhost:5000";

let collectionNames = [];

export const UserNFT = (props: any) => {
  let res = [];
  let Ikey = 0;
  const [NFTList, setNFTList] = useState([]);
  const [updated, setupdated] = useState(false);
  console.log("props", props);
  const { publicKey } = useWallet();

  const getCollections = async () => {
    try {
      console.log("abc", publicKey.toBase58());
      const owner = publicKey.toBase58();
      const response = await axios
        .post(`${baseURL}/FetchCollectionsByAddress`, { owner: owner })
        .then((res) => {
          return res.data;
        });

      return response;
    } catch (error) {
      console.log("ERROR", error);
    }
  };

  const fetchedNft = async () => {
    res = await getCollections();
    try {
      res.map((x) => {
        if (collectionNames.indexOf(x.collectionName) == -1) {
          collectionNames.push(x.collectionName);
        }
      });
      console.log("collection list 2", collectionNames);
      console.log("res", res);
      setupdated(true);
      setNFTList(res);
    } catch {}
    console.log("collection", NFTList);
  };

  useEffect(() => {
    fetchedNft();
  }, []);

  return (
    <div>
      <Container gap={0}>
        <p>{props.type}</p>
        {updated && collectionNames
          ? collectionNames.map((nft) => {
              return (
                <>
                  <Row>
                    <h1>{nft}</h1>
                  </Row>
                  <Row>
                    <UserListedNFTs data={nft} />
                  </Row>
                </>
                // </Row>
              );
            })
          : "not Updated"}

        {/* </Grid.Container> */}
      </Container>
    </div>
  );
};
