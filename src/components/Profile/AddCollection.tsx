import { FormContainer, TextFieldElement } from "react-hook-form-mui";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";


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

const FilePicker = () => {
  
  const [hash, setHash] = useState(null);
  const [list, setList] = useState(null);
  const [createObjectURL, setCreateObjectURL] = useState(null);
  const [hashLoaded, sethashLoaded] = useState(false);
  const uploadToClient = (event) => {
    if (event.target.files && event.target.files[0]) {
      const i = event.target.files[0];
      setHash(i);
      setCreateObjectURL(URL.createObjectURL(i));
    }
  };
  const uploadToServer = async () => {
    console.log("url is", createObjectURL);
    let res = await fetch(createObjectURL);
    let data = await res.json();
    setTimeout(() => {
      setList(data);
    }, 1000);
    li = data;
    // setList(data);
    console.log("json is", li);
    sethashLoaded(true);
  };
  const getList = () => {
    return list;
  };
  return (
    <>
      <input type="file" name="myImage" onChange={uploadToClient} />
      <button
        className="btn btn-primary"
        type="submit"
        onClick={uploadToServer}
      >
        {!hashLoaded ? "Load Hash-List" : "Hash-List loaded!"}
      </button>
    </>
  );
};

export function CollectionForm() {
  const { publicKey } = useWallet();
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [desc, setdesc] = useState("");
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

   console.log("pubkey is", publicKey);

 const makeColl = () => {;
  let collection = {
    name: name,
    symbol: symbol,
    image: imageURL,
    description: desc,
    hash: li,
    creator:publicKey
  }
  axios.post(`${baseURL}/addCollection`, collection)
    .then(response => console.log("response",response))
    .catch(error => {
      console.error('There was an error!', error); 
    });
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
          <Col css={{ w: "100%" }} align="center" span={3}>
            <FilePicker />
          </Col>
        </Row>
        <Row
          gap={1}
          css={{ padding: "30px 0" }}
          justify="center"
          align="center"
        >
          <Col span={3} align="center">
            <Button color="gradient" type="submit" onClick={makeColl}>
              Add Collection
            </Button>
          </Col>
        </Row>
      </Container>
    </>
  );
}
