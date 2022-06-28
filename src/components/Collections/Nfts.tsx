// import { FC } from 'react';
import { produceWithPatches } from "immer";
import React from "react";
import Link from "next/link";
import { Card, Col, Row, Text, Button } from "@nextui-org/react";
import {
  Metaplex,
  bundlrStorage,
  walletAdapterIdentity,
} from "@metaplex-foundation/js-next";
import { Connection, clusterApiUrl, PublicKey } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import { FC, useCallback, useState } from "react";

export const Nfts = (props) => {
  console.log("props", props);
  const [image, setimage] = useState("");
  const [name, setName] = useState("");
  const [updated, setupdated] = useState(false);
  

  const pic = async (data) => {
    console.log("data", data);
    const connection = new Connection(clusterApiUrl("devnet"));
    const { publicKey } = useWallet();
    const wallet = useWallet();
    const metaplex = Metaplex.make(connection)
      //@ts-ignore
      .use(walletAdapterIdentity(wallet))
      .use(bundlrStorage());
    const mint = new PublicKey(data);

    const nft = await metaplex.nfts().findByMint(mint);
    console.log("nftdata", nft.uri);
    let uri = await fetch(nft.uri);
    let res = await uri.json();
    if (!updated) setimage(res.image);
    setName(nft.name);
    setupdated(true);
  };
  pic(props.data.mintKey);

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
                textAlign: "center"
              }}
            >
              <Text
                css={{ w: "100%" }}
                size={12}
                weight="bold"
                transform="uppercase"
                color="#fff"
              >
                {name}
              </Text>
              <Text size={12} weight="bold" transform="uppercase" color="#fff">
                Price: {props.data.priceAmount}
              </Text>
              <Text size={12} weight="bold" transform="uppercase" color="#fff">
                {props.collection}
              </Text>
              <Link
                href={{
                  pathname: "/buy",
                  query: { mint: props.data.mintKey.toString() },
                }}
              >
                <Button size="sm" color="gradient" css={{margin: "auto"}}>
                  <span className="block group-disabled:hidden ">Buy</span>
                </Button>
              </Link>
            </Col>
          </Row>
        </Card.Footer>
      </Card>
    </>
  );
};