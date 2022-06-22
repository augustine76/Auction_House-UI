// import { FC } from 'react';
import { produceWithPatches } from "immer";
import React from "react";
import Link from "next/link";
import { Card, Col, Row, Text, Button } from "@nextui-org/react";

export const Collections = (props) => {
  console.log("props", props);

  return (
    <>
      <Card css={{ w: "100%", h: "300px" }}>
        <Card.Header css={{ position: "absolute", zIndex: 1, top: 0 }}>
          <Col></Col>
        </Card.Header>
        <Card.Body css={{ p: 0 }}>
          <Card.Image
            src="https://gateway.pinata.cloud/ipfs/QmYLxwKaXbuFiQm8N7FuAqUzwXz3o9tQDWB7WY2MniKL3j"
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
                {props.data.name}
              </Text>
              <Text color="#fff">{props.collection}</Text>
              <Text color="#fff" size={12}>
                {props.data.description}
              </Text>
              <Button color={"gradient"}> View NFT</Button>
            </Col>
          </Row>
        </Card.Footer>
      </Card>
    </>
  );
};
