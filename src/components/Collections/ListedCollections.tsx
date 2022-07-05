// @ts-nocheck
import { FC, useCallback, useState } from "react";
import React, { useEffect } from "react";
import { Collections } from "./Collections";
import { Container, Card, Col, Row, Grid } from "@nextui-org/react";
import axios from "axios";
const baseURL = "https://34.238.117.105:5100";
export const ListedCollections = () => {
  let res = [];
  let Ikey = 0;
  const [collectionList, setCollectionList] = useState([]);
  const [updated, setupdated] = useState(false);
  const getCollections = async () => {
    try {
      const response = await axios.post(`${baseURL}/fetchAllCollection`)
        .then(res => {
          return res;
        });

      console.log("Inside Fetch", response);
      return response.data;
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
    setTimeout(() => { }, 10000);
    console.log("Exucute useEffect");
    onClick();
  }, []);

  return (
    <>
      <Container>
        <Row gap={2} justify="center" align="center">
          <Grid.Container gap={2} justify="center">
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
