import { useWallet } from "@solana/wallet-adapter-react";
import { FC, useCallback, useState } from "react";
import React, { useEffect } from "react";
import { notify } from "../../utils/notifications";
import {
  Metaplex,
  bundlrStorage,
  walletAdapterIdentity,
} from "@metaplex-foundation/js-next";
import { Connection, clusterApiUrl } from "@solana/web3.js";
import { Collections } from "./Collections";
import { Container, Card, Col, Row, Grid } from "@nextui-org/react";
import axios from "axios";
const baseURL = "http://localhost:5100";
export const ListedCollections = () => {
  let res = [];
  let Ikey = 0;
  const [collectionList, setCollectionList] = useState([]);
  const [updated, setupdated] = useState(false);
  const getCollections = async () => {
    try {
      const response = await axios(`${baseURL}/fetchAllCollection`);
      // const result = await response.json();
      console.log("Inside Fetch");
      // console.log(response.data);
      return response.data;
      let data = await response.data;
      await setCollectionList(data);
      console.log(collectionList);
    } catch (error) {
      console.log("ERROR", error);
    }
  };
  const onClick = async () => {
    res = await getCollections();
    console.log(res);
    setupdated(true);
    setCollectionList(res);
    console.log(collectionList);
  };

  useEffect(() => {
    setTimeout(() => {}, 10000);
    console.log("Exucute useEffect");
    onClick();
  }, []);

  return (
    <>
      <Container>
        <Row gap={2} justify="center" align="center">
          <Grid.Container gap={2} justify="center" align="center">
            {collectionList.map((x) => {
              return (
                <Grid justify="center" xs={12} md={2} lg={2}>
                  <Collections data={x} key={Ikey++} />
                </Grid>
              );
            })}
          </Grid.Container>
        </Row>
      </Container>
    </>
  );
};
