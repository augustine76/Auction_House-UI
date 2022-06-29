import { FormContainer, TextFieldElement } from "react-hook-form-mui";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { Metaplex, keypairIdentity, bundlrStorage } from "@metaplex-foundation/js";
import { Connection, clusterApiUrl,  PublicKey } from "@solana/web3.js";
import * as anchor from '@project-serum/anchor';
import { Grid, Loading } from "@nextui-org/react";

// import { Candy } from "components/Collections/Candy";


import {
  Input,
  Container,
  Row,
  Col,
  Textarea,
  Button,
} from "@nextui-org/react";



import TextareaAutosize from '@mui/material/TextareaAutosize';
import { useWallet } from "@solana/wallet-adapter-react";


const baseURL = "http://localhost:5000"; 


let li;

const { publicKey } = useWallet();
const wallet = useWallet();


export function CollectionForm() {
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [desc, setdesc] = useState("");
  const [cmid, setcmid] = useState("");
  const router = useRouter(); 


  const {
    query: { pubkey },
  } = router;

  console.log("pubkey is", pubkey);

  // const makeColl = () => {
  //   let collection = {
  //     name: name,
  //     symbol: symbol,
  //     image: imageURL,
  //     description: desc,
  //     hash: li,
  //     creator: "HAekfA31B92bVyvWMjAV6Wk3XatCAhSdttaoZvjyteQw",
  //   };
  //   axios
  //     .post(`${baseURL}/addCollection`, collection)
  //     .then((response) => console.log("response", response))
  //     .catch((error) => {
  //       console.error("There was an error!", error);
  //     });
  // };

  // console.log("pubkey is", publicKey);
  let arr = [];
  const [list, setList] = useState([]);

 const makeColl = () => {;
  let collection = {
    name: name,
    symbol: symbol,
    image: imageURL,
    description: desc,
    hash: list,
    creator:publicKey
  }
  axios.post(`${baseURL}/addCollection`, collection)
    .then(response => console.log("response",response))
    .catch(error => {
      console.error('There was an error!', error); 
    });
  }

  const click = () => {
      console.log(
          'inside click', list
      )

  }
  const [arrLoaded, setarrLoaded] = useState(false);

  async function findCandyMachine() {
      let candyMachineAddress = "8jBGLLnbyD87K4LDRjBcPG6u85EwoHx5c8yw6w3sbtVu";
      
      console.log("Inside candy");
  

      const connection = new Connection(clusterApiUrl("devnet"));
      // const wallet = useWallet();
      const metaplex = Metaplex.make(connection)
      .use(keypairIdentity(wallet))
      .use(bundlrStorage());
      
      const UltimateCandyMachine = new PublicKey('cndy3Z4yapfJBmL3ShUp5exZKqR3z33thTzeNMm2gRZ');
  
      // const { publicKey } =  useWallet();
      const provider = new anchor.AnchorProvider(connection,wallet);
      // console.log(await publicKey.toBase58(), "pubkey in candy");
      const idl = await anchor.Program.fetchIdl(UltimateCandyMachine,provider,);
      const program = new anchor.Program(idl,UltimateCandyMachine,provider,);
  
      const candy = await program.account.candyMachine.fetch(candyMachineAddress)
      console.log(await candy.authority.toBase58(), "Authority");
     
  
      if(await candy.authority.toBase58() == publicKey){
          
          const nfts = await metaplex.nfts().findAllByCandyMachine(await new PublicKey(candyMachineAddress));
  
          console.log(nfts);
  
          nfts.map(x => {
              arr.push(x.mint.toBase58());
          })
  
          console.log("arr is" ,arr);
          setList(arr);
          setarrLoaded(true);
          
  
      }
      else {
          console.log("wallet address is not the authority of given candy machine")
      }
    }
    // findCandyMachine();

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
          <Col css={{ w: "100%" }} align="center" span={3}>
            {/* <FilePicker /> */}
          </Col>
        </Row>
        <Row
          gap={1}
          css={{ padding: "30px 0" }}
          justify="center"
          align="center"
        >
        {/* <button
        className="btn btn-primary"
        type="submit"
      >
      Load Hash-List
      </button> */}
          <Col span={3} align="center">
            <Button color="gradient" type="submit" onClick={makeColl}>
              Add Collection 
            </Button>
          </Col>
        </Row>
        <Grid.Container gap={2}>
        <Grid>
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
          <Button disabled auto bordered color="success" css={{ px: "$13" }}>
          <Loading type="points" color="currentColor" size="sm" />
        </Button>

        }

        <button>
            Show List
        </button>

         </Grid>
        </Grid.Container>
        {/* <Candy /> */}
        <button onClick={findCandyMachine}>
          findCandyMachine
        </button>
      </Container>
    </>
  );
}
