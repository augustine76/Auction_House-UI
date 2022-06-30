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
  Modal,
} from "@nextui-org/react";

// import { signIn, signOut, useSession } from 'next-auth/client';
const baseURL = "http://localhost:5100";
export const UserDetails = () => {
  const [issignin, setIssignin] = useState(false);
  // const [session] = useSession();
  const network = WalletAdapterNetwork.Devnet;
  const wallets = [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter({ network }),
  ];

  const [pubkey, setPubkey] = useState("");

  const { publicKey, signMessage } = useWallet();
  const [displayName, setDisplayName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");

  const [visible, setVisible] = useState(false);
  const handler = () => setVisible(true);

  const closeHandler = () => {
    setVisible(false);
    console.log("closed");
  };

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
  const changeHandler = async () => {
    const user = { publicKey: publicKey, userName: userName, displayName: displayName, email: email };
    axios
      .post(`${baseURL}/editUser`, user)
      .then((response) => console.log(response))
      .catch((error) => {
        console.error("There was an error!", error);
      });
      setVisible(false);
  }

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
             
            </Row>
            <Row justify="center" align="center">
            <Text css={{ size: "$10",color: "white" }}>{userName}</Text>
           
            </Row>
            <Row justify="center" align="center">
            <Text css={{ size: "$50",color: "white" }}>{displayName}</Text>
           
            </Row>
            <Row justify="center" align="center">
              <Col>
                <Grid.Container gap={2} justify="center">
                  <Grid xs={4} justify="center">
                    <Text blockquote className="publicKey">{pubkey}</Text>
                  </Grid>
                </Grid.Container>
              </Col>
            </Row>
            <Row justify="center" align="center">
              <Col span={5}>
                <Grid.Container gap={2} justify="center">
                  <Grid xs={12} xl={4} md={4} justify="center">
                    <Button size="sm" color="gradient" onClick={handler}>
                      Edit Profile
                    </Button>
                  </Grid>
                  <Grid xs={12} xl={4} md={4} justify="center">
                    <Button size="sm" color="gradient">
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
                  <Grid xs={12} xl={4} md={4} justify="center">
                    <Button size="sm" color="gradient">
                      <Link href="/">SignOut</Link>
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
            <Row justify="center" align="center" css={{ padding: "30px 0" }}>
              <Button size="sm" color="gradient" onClick={getSignIn}>
                SignIn
              </Button>
            </Row>
          </>
        )}

        <Modal
          closeButton
          aria-labelledby="modal-title"
          open={visible}
          onClose={closeHandler}
        >
          <Modal.Header>
            <Text id="modal-title" size={18}>
              Change Details
            </Text>
          </Modal.Header>
          <Modal.Body>
            <Row css={{ padding: "5px 0" }}>
              <Input
                value={userName}
                clearable
                bordered
                fullWidth
                color="primary"
                size="lg"
                placeholder="Name"
                helperText="Change user Name"
                onChange={(e) => { setUserName(e.target.value) }}
              />
            </Row>
            <Row css={{ padding: "5px 0" }}>
              <Input
                value={displayName}
                clearable
                bordered
                fullWidth
                color="primary"
                size="lg"
                placeholder="Name"
                helperText="Change display Name"
                onChange={(e) => { setDisplayName(e.target.value) }}
              />
            </Row>
            <Row css={{ padding: "5px 0" }}>
              <Input
                clearable
                bordered
                fullWidth
                color="primary"
                size="lg"
                placeholder="Email"
                helperText="Change Email"
                onChange={(e) => { setEmail(e.target.value) }}
              />
            </Row>
            <Row justify="space-between"></Row>
          </Modal.Body>
          <Modal.Footer>
            <Button auto flat color="error" onClick={closeHandler}>
              Close
            </Button>
            <Button auto onClick={changeHandler}>
              Change
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </>
  );
};