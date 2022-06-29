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
const baseURL = "http://localhost:5100";
import { buy } from "../../api/src/auction-house";
import axios from "axios";

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

  const connection = new Connection(clusterApiUrl("devnet"));
  const { publicKey } = useWallet();
  const wallet = useWallet();
  let auctionHouseAddress = "BnHNmwRwMHpjq9LBkvQYTkMGRAY4yuWcT5nnGhVq4SBr";

  const pic = async (data) => {
    console.log("data", data);

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



  function getBuy() {

    let price = props.data.priceAmount;
    let mint = props.data.mintKey;
    let sellerWallet = props.data.owner;
   buy({ auctionHouse: auctionHouseAddress, buyPrice: price, tokenSize: '1', mint: mint, env: 'devnet', wallet: wallet, sellerWallet: sellerWallet }).then(x => {
      // alert('Buy / offer Action'+'Offer: '+x);
      const data = { mintKey: mint, owner: sellerWallet, buyer: publicKey };
      axios.post(`${baseURL}/buyNft`, data)
        .then(response => {
          console.log(response)
          window.location.href = "http://localhost:3000/";
        })
        .catch(error => {
          console.error('There was an error!', error);
        });

    })

  }

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
                Price: {props.data.priceAmount}
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
                <Button color={"gradient"} auto onClick={getBuy}>
                  Buy For {props.data.priceAmount} SOL
                </Button>
              </Row>
            </Col>
          </Row>
        </Modal.Footer>
      </Modal>
    </>
  );
};
