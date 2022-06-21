import { FC, useCallback, useEffect, useState } from "react";
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
import { signIn, signOut, useSession } from "next-auth/react";
import axios from "axios";
import Link from "next/link";
import {
  Container,
  Row,
  Input,
  Col,
  Avatar,
  Grid,
  Button,
  Text,
} from "@nextui-org/react";

// import { signIn, signOut, useSession } from 'next-auth/client';
const baseURL = "http://localhost:5000";
export const UserDetails = () => {
  const [issignin, setIssignin] = useState(false);
  // const [session] = useSession();
  const network = WalletAdapterNetwork.Devnet;
  const wallets = [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter({ network }),
  ];
  const endpoint = clusterApiUrl(network);
  const [pubkey, setPubkey] = useState("");
  const connection = new Connection(endpoint);
  const { publicKey, signMessage } = useWallet();
  const [displayName, setDisplayName] = useState("");
  const [userName, setUserName] = useState("");

  const wallet = useWallet();

  async function fetchNonce() {
    const response = await fetch("api/login");

    if (response.status != 200) throw new Error("nonce could not be retrieved");

    const { nonce } = await response.json();

    return nonce;
  }

  const getSignIn = async () => {
    const nonce = await fetchNonce();

    const message = `Sign this message for authenticating with your wallet. Nonce: ${nonce}`;
    const encodedMessage = new TextEncoder().encode(message);
    const signedMessage = await solana.request({
      method: "signMessage",
      params: {
        message: encodedMessage,
      },
    });

    signIn("credentials", {
      redirect: false,
      publicKey: signedMessage.publicKey,
      signature: signedMessage.signature,
    });
    setIssignin(true);
    try {
      const user = { publicKey: publicKey, signature: signedMessage.signature };
      axios
        .post(`${baseURL}/createUser`, user)
        .then((response) => console.log(response))
        .catch((error) => {
          console.error("There was an error!", error);
        });

      axios
        .get(`${baseURL}/getUserDetails/${publicKey}`)
        .then((response) => {
          console.log("user details", response);
          console.log("pub key", response.data.data.publicKey);
          setPubkey(response.data.data.publicKey);
          console.log(pubkey);
          if (response.data.data.userName) {
            setUserName(response.data.data.userName);
          }
          if (response.data.data.displayName) {
            setDisplayName(response.data.data.displayName);
          }
        })
        .catch((error) => {
          console.error("There was an error!", error);
        });
    } catch (err) {
      console.log(err);
    }
  };

  const getSignout = async () => {
    signOut();
    setIssignin(false);
  };

  return (
    <>
      <Container>
        {issignin ? (
          <>
            <Row justify="center" align="center">
              <Avatar
                color="gradient"
                bordered
                src="https://i.pravatar.cc/150?u=a04258114e29026702d"
                css={{ size: "$50" }}
              />
              <Text>{displayName}</Text>
            </Row>
            <Row justify="center" align="center">
              <Col>
                <Grid.Container gap={2} justify="center">
                  <Grid xs={4} justify="center">
                    <Text blockquote>{pubkey}</Text>
                  </Grid>
                </Grid.Container>
              </Col>
            </Row>
            <Row justify="center" align="center">
              <Col span={5}>
                <Grid.Container gap={2} justify="center">
                  <Grid xs={4} justify="center">
                    <Button color="gradient">Edit Profile</Button>
                  </Grid>
                  <Grid xs={4} justify="center">
                    <Button color="gradient">
                      <Link
                        href={{
                          pathname: "/collectionForm",
                          query: { pubkey: pubkey },
                        }}
                      >
                        Add Collection
                      </Link>
                    </Button>
                  </Grid>
                  <Grid xs={4} justify="center">
                    <Button onClick={getSignout} color="gradient">
                      SignOut
                    </Button>
                  </Grid>
                </Grid.Container>
              </Col>
            </Row>
          </>
        ) : (
          <>
            <Row justify="center" align="center">
              <Avatar
                color="gradient"
                bordered
                src="https://i.pravatar.cc/150?u=a04258114e29026702d"
                css={{ size: "$50" }}
              />
            </Row>
            <Row justify="center" align="center" css={{padding: "30px 0"}}>
              <Button color="gradient" onClick={getSignIn}>
                SignIn
              </Button>
            </Row>
          </>
        )}
      </Container>
    </>
  );
};
