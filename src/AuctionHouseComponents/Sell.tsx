import { useWallet } from "@solana/wallet-adapter-react";
import { FC, useCallback, useState } from "react";
import BasicTextFields from "../components/InputsComponent";
import { Input, Button, Row, Container, Col } from "@nextui-org/react";

import { sell } from "../api/src/auction-house";

export const Sell: FC = () => {
  let walletAddress = "";

  const { publicKey } = useWallet();
  const [price, setPrice] = useState(""); // '' is the initial state value
  const [mintAddress, setMintAddress] = useState(""); // '' is the initial state value
  const [auctionHouseAddress, setAuctionHouseAddress] = useState(""); // '' is the initial state value

  const wallet = useWallet();

  function getSell() {
    console.log("ah,auction", auctionHouseAddress);

    sell({
      auctionHouse: auctionHouseAddress,
      buyPrice: price,
      mint: mintAddress,
      tokenSize: "1",
      wallet: wallet,
    }).then((x) => {
      alert(
        "Create Sell Action" +
          "Account" +
          x.account +
          "MintAddress" +
          x.mintAddress +
          "Price" +
          x.price
      );
    });
  }

  return (
    <>
      <Container css={{ paddingTop: "20px" }}>
        <Row
          gap={1}
          css={{ padding: "30px 0" }}
          justify="center"
          align="center"
        >
          <Col>
            <Input
              color="default"
              size="lg"
              clearable
              underlined
              labelPlaceholder="Auction House Address"
              onChange={(e) => {
                setAuctionHouseAddress(e.target.value);
              }}
            />
          </Col>
          <Col>
            <Input
              labelPlaceholder="Mint Address"
              color="default"
              size="lg"
              clearable
              underlined
              onChange={(e) => {
                setMintAddress(e.target.value);
              }}
            />
          </Col>
          <Col>
            <Input
              labelPlaceholder="Price"
              color="default"
              size="lg"
              clearable
              underlined
              onChange={(e) => {
                setPrice(e.target.value);
              }}
            />
          </Col>
        </Row>
        <Row justify="center" align="center">
          <button
            className="group w-60 m-2 btn animate-pulse disabled:animate-none bg-gradient-to-r from-[#9945FF] to-[#14F195] hover:from-pink-500 hover:to-yellow-500 ... "
            onClick={getSell}
            disabled={!publicKey}
          >
            <div className="hidden group-disabled:block ">
              Wallet not connected
            </div>
            <span className="block group-disabled:hidden">Sell</span>
          </button>
        </Row>
      </Container>
    </>
  );
};
