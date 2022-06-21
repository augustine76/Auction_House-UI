import { useWallet } from "@solana/wallet-adapter-react";
import { FC, useCallback, useState } from "react";
import { Input, Button, Row, Container, Col } from "@nextui-org/react";

import { execute_sale } from "../api/src/auction-house";

export const ExecuteSell: FC = () => {
  let walletAddress = "";

  const { publicKey } = useWallet();
  const [price, setPrice] = useState(""); // '' is the initial state value
  const [mintAddress, setMintAddress] = useState(""); // '' is the initial state value
  const [auctionHouseAddress, setAuctionHouseAddress] = useState(""); // '' is the initial state value
  const [buyerAccount, setBuyerAccount] = useState(""); // '' is the initial state value
  const [sellerAccount, setSellerAccount] = useState(""); // '' is the initial

  const wallet = useWallet();

  function getExecuteSale() {
    execute_sale({
      auctionHouse: auctionHouseAddress,
      buyPrice: price,
      mint: mintAddress,
      tokenSize: "1",
      buyerWallet: buyerAccount,
      sellerWallet: sellerAccount,
      env: "devnet",
      wallet: wallet,
    });
    alert("Execute Sale");
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
              size="lg"
              clearable
              underlined
              labelPlaceholder="Mint Address"
              onChange={(e) => {
                setAuctionHouseAddress(e.target.value);
              }}
            />
          </Col>
        </Row>

        <Row
          gap={1}
          css={{ padding: "30px 0" }}
          justify="center"
          align="center"
        >
          <Col>
            <Input
              size="lg"
              clearable
              underlined
              labelPlaceholder="Buyer Account"
              onChange={(e) => {
                setAuctionHouseAddress(e.target.value);
              }}
            />
          </Col>
          <Col>
            <Input
              size="lg"
              clearable
              underlined
              labelPlaceholder="Seller Account"
              onChange={(e) => {
                setAuctionHouseAddress(e.target.value);
              }}
            />
          </Col>
        </Row>

        <Row
          justify="center"
          align="center"
          gap={2}
          css={{ padding: "30px 0" }}
        >
          <Col>
            <Input
              size="lg"
              clearable
              underlined
              labelPlaceholder="Price"
              onChange={(e) => {
                setAuctionHouseAddress(e.target.value);
              }}
            />
          </Col>
        </Row>
        <Row justify="center" align="center">
          <Col>
            <button
              className="group w-60 m-2 btn animate-pulse disabled:animate-none bg-gradient-to-r from-[#9945FF] to-[#14F195] hover:from-pink-500 hover:to-yellow-500 ... "
              onClick={getExecuteSale}
              disabled={!publicKey}
            >
              <div className="hidden group-disabled:block ">
                Wallet not connected
              </div>
              <span className="block group-disabled:hidden">Execute Sell</span>
            </button>
          </Col>
        </Row>
      </Container>
    </>
  );
};
