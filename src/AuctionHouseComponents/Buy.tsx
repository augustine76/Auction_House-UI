import { useWallet } from "@solana/wallet-adapter-react";
import { FC, useCallback, useState } from "react";
import { Input, Button, Row, Container, Col } from "@nextui-org/react";

import { buy } from "../api/src/auction-house";

export const Buy: FC = () => {
  const { publicKey } = useWallet();
  const [price, setPrice] = useState("");
  const [mintAddress, setMintAddress] = useState("");
  const [auctionHouseAddress, setAuctionHouseAddress] = useState("");

  const wallet = useWallet();

  function getBuy() {
    buy({
      auctionHouse: auctionHouseAddress,
      buyPrice: price,
      tokenSize: "1",
      mint: mintAddress,
      env: "devnet",
      wallet: wallet,
    }).then((x) => {
      alert("Buy / offer Action" + "Offer: " + x);
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
            onClick={getBuy}
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
