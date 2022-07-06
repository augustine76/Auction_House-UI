// @ts-nocheck
// TODO: SignMessage

import { FC, useCallback, useState } from "react";
import { notify } from "../utils/notifications";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { clusterApiUrl } from "@solana/web3.js";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { Connection } from "@solana/web3.js";
import { actions } from "@metaplex/js";
const { mintNFT } = actions;
import { Input, Button, Row, Container, Col } from "@nextui-org/react";

export const SignMessage: FC = () => {
  const network = WalletAdapterNetwork.Devnet;
  const wallets = [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter({ network }),
  ];
  const endpoint = clusterApiUrl(network);

  const connection = new Connection(endpoint);
  const { publicKey, signMessage } = useWallet();
  const [URI, setURI] = useState("");

  const wallet = useWallet();
  const onClick = useCallback(async () => {
    try {
      alert(
        "MetaData Field should contain a creator address same as the minter"
      );
      const nft = await mintNFT({ connection, wallet: wallet, uri: URI });

      console.log(nft);
    } catch (err) {
      console.log(err);
    }
  }, [publicKey, notify, signMessage]);

  return (
    <>
      <Container css={{ paddingTop: "20px" }}>
        <Row
          css={{ padding: "30px 0" }}
          justify="center"
          align="center"
        >
          <Input
            color="primary"
            size="lg"
            clearable
            underlined
            labelPlaceholder="Auction House Address"
            onChange={(e) => {
              setURI(e.target.value);
            }}
          />
        </Row>
        <Row justify="center" align="center">
          <Button onClick={onClick} color="gradient">
            {!publicKey ? "Wallet not connected" : "Wallet not connected"}
          </Button>
        </Row>
      </Container>
    </>
  );
};
