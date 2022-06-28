import { FC, useCallback, useState } from "react";
import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { Nfts } from "./Nfts";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Avatar,
  Grid,
  Modal,
  Text,
  Image,
  Button
} from "@nextui-org/react";

const baseURL = "http://localhost:5100";
export const ListedNfts = () => {
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
  const getCollectionInfo = async () => {
    try {
      const response = await axios(
        `${baseURL}/getCollectionInfo/${collectionName}`
      );

      console.log("Inside Fetch");
      console.log(response.data);
      return response.data.data.image;
    } catch (error) {
      console.log("ERROR", error);
    }
  };
  const onClick = async () => {
    res = await getCollectionNFtS();
    console.log("collection nft", res);
    res2 = await getCollectionInfo();
    console.log("collection info", res2);
    setupdated(true);
    setCollectionList(res);
    setCollectionImage(res2);
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
            css={{ size: "$50", width: "250px" }}
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
        <Row
          gap={2}
          justify="center"
          align="center"
          css={{ marginTop: "20px" }}
        >
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
