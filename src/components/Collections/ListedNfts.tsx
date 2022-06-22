import { useWallet } from "@solana/wallet-adapter-react";
import { FC, useCallback, useState } from "react";
import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { notify } from "../../utils/notifications";
import {
  Metaplex,
  bundlrStorage,
  walletAdapterIdentity,
} from "@metaplex-foundation/js-next";
import { Connection, clusterApiUrl } from "@solana/web3.js";
import { Nfts } from "./Nfts";
import axios from "axios";
import { Container, Row, Col, Avatar, Grid, Spacer } from "@nextui-org/react";

const baseURL = "http://localhost:5000";
export const ListedNfts = () => {
  const router = useRouter();
  const {
    query: { collectionName },
  } = router;

  let res = [];
  let Ikey = 0;
  const [collectionList, setCollectionList] = useState([]);
  const [updated, setupdated] = useState(false);
  const getCollections = async () => {
    try {
      setTimeout(() => {}, 10000);

      const response = await axios(
        `${baseURL}/FetchListedNftsOfCollection/${collectionName}`
      );
      // const result = await response.json();
      console.log("Inside Fetch");
      console.log(response.data);
      return response.data.data;
      let data = await response.data;
      await setCollectionList(data);
      console.log(collectionList);
    } catch (error) {
      console.log("ERROR", error);
    }
  };
  const onClick = async () => {
    res = await getCollections();
    console.log("res mintkey", res);

    setupdated(true);
    setCollectionList(res);
    console.log("collectionList", collectionList);
  };

  useEffect(() => {
    setTimeout(() => {}, 10000);
    console.log("Exucute useEffect");
    onClick();
  }, []);

  const gridCardStyle = {
    bg: "rgb(66 64 64)",
    borderRadius: "10px",
    color: "#fff",
    padding: "15px",
    justify: "center",
    background: "#000",
    width: "100%",
    textAlign: "center"
  };
  return (
    <>
      <Container>
        <Row justify="center" align="center">
          <Avatar
            color="gradient"
            bordered
            src="https://i.pravatar.cc/150?u=a04258114e29026702d"
            css={{ size: "$50" }}
          />
        </Row>
        <Row justify="center" align="center">
          <h4>{collectionName}</h4>
        </Row>
        <Row gap={2} justify="center" align="center" css={{marginTop: "20px"}}>
          <Col span={6}>
            <Grid.Container gap={1} justify="center">
              <Grid xs={6} md={4} lg={4} justify="center">
                <div style={gridCardStyle}>
                  <p>FLOOR PRICE</p>
                  <p>0.03</p>
                </div>
              </Grid>
              <Grid xs={6} md={4} lg={4} justify="center">
                <div style={gridCardStyle}>
                  <p>FLOOR PRICE</p>
                  <p>0.03</p>
                </div>
              </Grid>
              <Grid xs={6} md={4} lg={4} justify="center">
                <div style={gridCardStyle}>
                  <p>FLOOR PRICE</p>
                  <p>0.03</p>
                </div>
              </Grid>
              <Grid xs={6} md={4} lg={4} justify="center">
                <div style={gridCardStyle}>
                  <p>FLOOR PRICE</p>
                  <p>0.03</p>
                </div>
              </Grid>
              <Grid xs={6} md={4} lg={4} justify="center">
                <div style={gridCardStyle}>
                  <p>FLOOR PRICE</p>
                  <p>0.03</p>
                </div>
              </Grid>
              <Grid xs={6} md={4} lg={4} justify="center">
                <div style={gridCardStyle}>
                  <p>FLOOR PRICE</p>
                  <p>0.03</p>
                </div>
              </Grid>
            </Grid.Container>
          </Col>
        </Row>
        <Row gap={2} justify="center" align="center" css={{marginTop:"20px"}}>
          <p>All Items</p>
        </Row>
        <Row gap={2} justify="center" align="center">
          <Grid.Container gap={2} justify="center">
            {collectionList.map((x) => {
              return (
                <Grid xs={2} md={4} lg={2} justify="center">
                  <Nfts data={x} key={Ikey++} />
                </Grid>
              );
            })}
          </Grid.Container>
        </Row>
      </Container>
    </>
  );
};
