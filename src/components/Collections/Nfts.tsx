// import { FC } from 'react';
import { produceWithPatches } from "immer";
import React from "react";
import Link from "next/link";
import {
  Metaplex,
  bundlrStorage,
  walletAdapterIdentity,
} from "@metaplex-foundation/js-next";
import { Connection, clusterApiUrl, PublicKey } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import { FC, useCallback, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Grid,
  Modal,
  Text,
  Image,
  Button,
} from "@nextui-org/react";

export const Nfts = (props) => {
  console.log("props", props);
  const [image, setimage] = useState("");
  const [name, setName] = useState("");
  const [updated, setupdated] = useState(false);
  // console.log("props",props);
  const [visible, setVisible] = React.useState(false);
  const handler = () => setVisible(true);
  const closeHandler = () => {
    setVisible(false);
    console.log("closed");
  };

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
                {name}
              </Text>
              <Text size={12} weight="bold" transform="uppercase" color="#fff">
                Price: {props.data.amount}
              </Text>
              <Text size={12} weight="bold" transform="uppercase" color="#fff">
                {props.collection}
              </Text>
              <Button
                size="sm"
                color="gradient"
                css={{ margin: "auto" }}
                onClick={handler}
              >
                <span className="block group-disabled:hidden ">Buy</span>
              </Button>
            </Col>
          </Row>
        </Card.Footer>
      </Card>

      <Modal
        css={{ padding: "10px" }}
        blur
        aria-labelledby="modal-title"
        noPadding
        open={visible}
        onClose={closeHandler}
      >
        <Modal.Header>
          <Text h2 id="modal-title">
            {name}
          </Text>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Image showSkeleton src={image} />
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Row>
            <Col>
              <Row justify="center">
                <Button color={"gradient"} auto onClick={() => alert("Buy option")}>
                  Buy For {props.data.amount} SOL
                </Button>
              </Row>
            </Col>
          </Row>
        </Modal.Footer>
      </Modal>
    </>
  );
};
