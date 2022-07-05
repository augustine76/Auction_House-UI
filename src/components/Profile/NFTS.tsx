// @ts-nocheck
// import { FC } from 'react';
import { produceWithPatches } from "immer";
import React, { useState } from "react";
import Link from "next/link";
import axios from "axios";
import { Card, Col, Row, Text, Button } from "@nextui-org/react";

const baseURL = "http://54.172.59.172:5100";

export const NFTS = (props) => {
  const [image, setimage] = useState("");
  const [updated, setupdated] = useState(false);
  const [listed, setListed] = useState(true);
  // console.log("props",props);
  const pic = async (data) => {
    let uri = await fetch(data);
    let res = await uri.json();
    // console.log("Res", res.image);
    if (!updated) setimage(res.image);
    setupdated(true);
  };
  pic(props.data.uri);
  // const test = (data) => {
  //     let res = abc(data);
  //     console.log("res", res)
  //     return res;
  // }

  axios
    .get(`${baseURL}/isListed`, {
      params: { mintKey: props.data.mint.toBase58() },
    })
    .then((res) => console.log("axios response is", res));

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
                textAlign: "center",
              }}
            >
              <Text
                css={{ w: "100%" }}
                size={12}
                weight="bold"
                transform="uppercase"
                color="#fff"
              >
                {props.data.name}
              </Text>
              <Text size={12} weight="bold" transform="uppercase" color="#fff">
                Price: {props.data.amount}
              </Text>
              <Text size={12} weight="bold" transform="uppercase" color="#fff">
                {props.collection}
                {props.data.mint.toBase58()}
              </Text>
              <Link
                href={{
                  pathname: "/buy",
                  query: { mint: props.data.mintKey.toString() },
                }}
              >
                <Button size="sm" color="gradient" css={{ margin: "auto" }}>
                  {listed ? (
                    <Link
                      href={{
                        pathname: "/nftdetails",
                        query: {
                          mint: props.data.mint.toString(),
                          uri: props.data.uri,
                        },
                      }}
                    >
                      <span className="block group-disabled:hidden ">Sell</span>
                    </Link>
                  ) : (
                    <span className="block group-disabled:hidden ">
                      Listed for Sale
                    </span>
                  )}
                </Button>
              </Link>
            </Col>
          </Row>
        </Card.Footer>
      </Card>
    </>
  );
};
