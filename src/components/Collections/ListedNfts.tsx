// @ts-nocheck
import { FC, useCallback, useState } from "react";
import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { Nfts } from "./Nfts";
import axios from "axios";
import NftActivity from "./NftActivity";
import {
  Container,
  Row,
  Col,
  Avatar,
  Grid,
  Modal,
  Text,
  Image,
  Button,
} from "@nextui-org/react";
const types = ["All Items", "NFTs Activity"];

const baseURL = "http://34.238.117.105:5100";
export const ListedNfts = () => {
  const [active, setActive] = useState(types[0]);
  const router = useRouter();
  const {
    query: { collectionName },
  } = router;

  let res = [];
  let Ikey = 0;
  let res2;
  const [collectionList, setCollectionList] = useState([]);
  const [updated, setupdated] = useState(false);
  const getCollectionNFtS = async () => {
    try {
      const response = await axios(
        `${baseURL}/FetchListedNftsOfCollection/${collectionName}`
      );

      console.log("Inside Fetch");
      console.log(response.data);
      return response.data.data;
    } catch (error) {
      console.log("ERROR", error);
    }
  };
  const [collectionImage, setCollectionImage] = useState(false);
  const [floorPrice, setFloorPrice] = useState(0);
  const [totalListedNfts, setTotalListedNfts] = useState(0);
  const [totalUniqueHolders, setTotalUniqueHolders] = useState(0);
  const [tradingVolume, setTradingVolume] = useState(0);
  
  const getCollectionInfo = async () => {
    try {
      const response = await axios(
        `${baseURL}/getCollectionInfo/${collectionName}`
      );
      
      console.log("Inside Fetch");
      console.log(response.data);
      return response.data.data;
    } catch (error) {
      console.log("ERROR", error);
    }
  };
  const onClick = async () => {
    res = await getCollectionNFtS();
    console.log("collection nft", res);
    res2 = await getCollectionInfo();
    console.log("collection info", res2);
    if(res2&&res){
    setupdated(true);
    setCollectionList(res);
    setCollectionImage(res2.image);
    setFloorPrice(res2.floorPrice);
    setTotalListedNfts(res2.totalListedNfts);
    setTotalUniqueHolders(res2.totalUniqueHolders);
    setTradingVolume(res2.tradingVolume);
    }
    
  };

  useEffect(() => {
    setTimeout(() => {}, 10000);
    console.log("Exucute useEffect");
    onClick();
  }, [collectionName]);

  const gridCardStyle = {
    bg: "rgb(66 64 64)",
    borderRadius: "10px",
    color: "#fff",
    padding: "15px",
    justify: "center",
    background: "#b559d9",
    width: "100%",
    textAlign: "center",
  };

  return (
    <>
      <Container>
        <Row justify="center" align="center">
          <Avatar
            color="gradient"
            bordered
            src={collectionImage}
            css={{ size: "250px", width: "250px" }}
          />
        </Row>
        <Row justify="center" align="center">
          <h4>{collectionName}</h4>
        </Row>
        <Row
          gap={2}
          justify="center"
          align="center"
          css={{ marginTop: "20px" }}
        >
          <Col span={8}>
            <Grid.Container gap={1} justify="center">
              <Grid xs={12} md={4} lg={4} justify="center">
                <div style={gridCardStyle}>
                  <p>FLOOR PRICE</p>
                  <p>{floorPrice}</p>
                </div>
              </Grid>
              <Grid xs={12} md={4} lg={4} justify="center">
                <div style={gridCardStyle}>
                  <p>Total Liste NFTS</p>
                  <p>{totalListedNfts}</p>
                </div>
              </Grid>
              </Grid.Container>
              <Grid.Container gap={1} justify="center">
              <Grid xs={12} md={4} lg={4} justify="center">
                <div style={gridCardStyle}>
                  <p>Total Unique Holders</p>
                  <p>{totalUniqueHolders}</p>
                </div>
              </Grid>
              <Grid xs={12} md={4} lg={4} justify="center">
                <div style={gridCardStyle}>
                  <p>Trading Volume</p>
                  <p>{tradingVolume}</p>
                </div>
              </Grid>
              {/* <Grid xs={12} md={4} lg={4} justify="center">
                <div style={gridCardStyle}>
                  <p>FLOOR PRICE</p>
                  <p>0.03</p>
                </div>
              </Grid>
              <Grid xs={12} md={4} lg={4} justify="center">
                <div style={gridCardStyle}>
                  <p>FLOOR PRICE</p>
                  <p>0.03</p>
                </div>
              </Grid> */}
            </Grid.Container>
          </Col>
        </Row>
        <Row
          gap={2}
          justify="center"
          align="center"
          css={{
            marginTop: "20px",
            padding: "50px 0",
          }}
        >
          <Button.Group color="gradient" ghost ripple>
            {types.map((type) => (
              <Button key={type} onClick={() => setActive(type)}>
                {type}
              </Button>
            ))}
          </Button.Group>
        </Row>
        <Row gap={2} justify="center" align="center" css={{marginBottom: "50px"}}>
          {active == types[0] ? (
            <Grid.Container gap={2} justify="center">
              {collectionList && collectionList.map((x) => {
                return (
                  <Grid xs={12} md={4} lg={2} justify="center">
                    <Nfts data={x} key={Ikey++} />
                  </Grid>
                );
              })}
            </Grid.Container>
          ) : (
            <NftActivity collectionName={collectionName} />
          )}
        </Row>
      </Container>
    </>
  );
};
