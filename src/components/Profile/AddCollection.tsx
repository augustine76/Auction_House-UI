// @ts-nocheck
import Box from "@mui/material/Box";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { Metaplex, keypairIdentity, bundlrStorage } from "@metaplex-foundation/js";
import { Connection, clusterApiUrl, PublicKey } from "@solana/web3.js";
import * as anchor from '@project-serum/anchor';
import { Grid, Loading } from "@nextui-org/react";
import { Input, Container, Row, Col, Textarea, Button } from "@nextui-org/react";


import TextareaAutosize from '@mui/material/TextareaAutosize';
import { useWallet } from "@solana/wallet-adapter-react";

const baseURL = "http://34.224.215.17:5100";

export function CollectionForm() {
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [desc, setdesc] = useState("");
  const [cmid, setcmid] = useState("");
  const [list, setList] = useState([]);
  const [arrLoaded, setarrLoaded] = useState(false);
  const [loading, setloading] = useState("Load NFTs from CM ID");
  const [err, setErr] = useState(null);

  const { publicKey } = useWallet();
  const wallet = useWallet();

  let arr = [];

  const makeColl = () => {
    ;
    let collection = {
      name: name,
      symbol: symbol,
      image: imageURL,
      description: desc,
      hash: list,
      creator: publicKey
    }
    axios.post(`${baseURL}/addCollection`, collection)
      .then(response => console.log("response", response))
      .catch(error => {
        console.error('There was an error!', error);
      });
  }

  async function findCandyMachine() {
    // let candyMachineAddress = "8jBGLLnbyD87K4LDRjBcPG6u85EwoHx5c8yw6w3sbtVu";
    setloading("Fetching NFTs, please wait...");

    let candyMachineAddress = cmid;

    console.log("Inside candy");


    const connection = new Connection(clusterApiUrl("devnet"));
    // const wallet = useWallet();
    const metaplex = Metaplex.make(connection)
      .use(keypairIdentity(wallet))
      .use(bundlrStorage());

    const UltimateCandyMachine = new PublicKey('cndy3Z4yapfJBmL3ShUp5exZKqR3z33thTzeNMm2gRZ');

    // const { publicKey } =  useWallet();
    const provider = new anchor.AnchorProvider(connection, wallet);
    // console.log(await publicKey.toBase58(), "pubkey in candy");
    const idl = await anchor.Program.fetchIdl(UltimateCandyMachine, provider,);
    const program = new anchor.Program(idl, UltimateCandyMachine, provider,);

    const candy = await program.account.candyMachine.fetch(candyMachineAddress)
    console.log(await candy.authority.toBase58(), "Authority");


    if (await candy.authority.toBase58() == publicKey) {

      const nfts = await metaplex.nfts().findAllByCandyMachine(await new PublicKey(candyMachineAddress));

      console.log(nfts);

      nfts.map(x => {
        arr.push(x.mint.toBase58());
      })

      console.log("arr is", arr);
      setList(arr);
      setarrLoaded(true);
    }
    else {
      console.log("wallet address is not the authority of given candy machine")
      alert("wallet address is not the authority of given candy machine");
      setErr("Wrong CM Authority");
    }
    setloading("NFTs loaded from CM");
  }

  return (
    <>
      <Container>
        <Row
          fluid
          gap={1}
          css={{ padding: "50px 0" }}
          justify="center"
          align="center"
        >
          <Col span={3}>
            <Input
              css={{ w: "100%" }}
              color="primary"
              size="lg"
              clearable
              underlined
              labelPlaceholder="Name"
              onChange={(e) => {
                setName(e.target.value);
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
          <Col span={3}>
            <Input
              css={{ w: "100%" }}
              labelPlaceholder="Symbol"
              color="primary"
              size="lg"
              clearable
              underlined
              onChange={(e) => {
                setSymbol(e.target.value);
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
          <Col span={3}>
            <Input
              css={{ w: "100%" }}
              labelPlaceholder="Image URL"
              color="primary"
              size="lg"
              clearable
              underlined
              onChange={(e) => {
                setImageURL(e.target.value);
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
          <Col span={3}>
            <Textarea
              css={{ w: "100%" }}
              labelPlaceholder="Description"
              color="primary"
              size="lg"
              underlined
              onChange={(e) => {
                setdesc(e.target.value);
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
          <Col span={3}>
            <Input
              css={{ w: "100%" }}
              labelPlaceholder="CM ID"
              color="primary"
              size="lg"
              clearable
              underlined
              onChange={(e) => {
                setcmid(e.target.value);
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
          <Col span={3}>
            {
              arrLoaded ?
                <div>
                  <button
                    className="btn btn-primary"
                    type="submit"
                  >
                    Loaded NFT List
                  </button>

                  {list.map((x) => {
                    return (
                      <li>
                        {x}
                      </li>
                    )
                  })}

                </div>
                :
               
                <button
                  className="btn btn-primary"
                  type="submit"
                  onClick={findCandyMachine}
                >
                  {loading}
                </button>

            }
          </Col>
        </Row>
        <Row
          gap={1}
          css={{ padding: "30px 0" }}
          justify="center"
          align="center"
        >
          <Col span={3}>
            <Button color="gradient" type="submit" onClick={makeColl}>
              Add Collection
            </Button>
          </Col>
        </Row>



      </Container>
    </>
  )
}