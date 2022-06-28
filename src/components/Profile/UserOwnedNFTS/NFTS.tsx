
import { produceWithPatches } from "immer";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Card, Col, Row, Text, Button } from "@nextui-org/react";
import {
  Metaplex,
  bundlrStorage,
  walletAdapterIdentity,
} from "@metaplex-foundation/js-next";
import { Connection, clusterApiUrl, PublicKey } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
export const NFTS = (props) => {
  console.log("props", props);
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const findNft = async (mintKey) => {
    const connection = new Connection(clusterApiUrl("devnet"));
    const { publicKey } = useWallet();
    const wallet = useWallet();
    const metaplex = Metaplex.make(connection)
      //@ts-ignore
      .use(walletAdapterIdentity(wallet))
      .use(bundlrStorage());
    const mint = new PublicKey(mintKey);

    const nft = await metaplex.nfts().findByMint(mint);
    console.log("nftdata", nft.uri);
    let uri = await fetch(nft.uri);
    let res = await uri.json();
    console.log("image", res.image);
    console.log("name", nft.name);
    console.log("collection", nft);
    console.log("des", res.description);
    setName(nft.name);
    setImage(res.image);
    setDescription(res.description);
  };
  findNft(props.mintKey);
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
             
              <Text color="#fff" size={12} margin="3px">
                {description}
              </Text>
              <Link
                href={{
                  pathname: "/nftdetails",
                  query: { mint: props.mintKey.toString() ,image:image,name:name},
                }}
              >
                <Button size="sm" color="gradient" css={{margin: "auto"}}>
                  <span className="block group-disabled:hidden ">Sell</span>
                </Button>
              </Link>
            </Col>
          </Row>
        </Card.Footer>
      </Card>
    </>
  );
};

