import { FormContainer, TextFieldElement } from 'react-hook-form-mui'
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { useState } from 'react';
import  axios  from "axios";
import { useRouter } from "next/router";
import TextareaAutosize from '@mui/material/TextareaAutosize';



const baseURL = "http://localhost:5001"; 

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
    }, 1000)
    li = data;
    // setList(data);
    console.log("json is", li);
    sethashLoaded(true);
  }
  const getList = () => {
    return list;
  }
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
  )
}

export function CollectionForm() {
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [desc, setdesc] = useState("");
  const router = useRouter()

  const {
    query : { pubkey },
} = router

 console.log("pubkey is", pubkey);

 const makeColl = () => {;
  let collection = {
    name: name,
    symbol: symbol,
    image: imageURL,
    description: desc,
    hash: li,
    creator:"HAekfA31B92bVyvWMjAV6Wk3XatCAhSdttaoZvjyteQw"
  }
  axios.post(`${baseURL}/addCollection`, collection)
    .then(response => console.log("response",response))
    .catch(error => {
      console.error('There was an error!', error); 
    });
  }
  return (
<div>
            <Box
                component="form"
                sx={{
                    '& > :not(style)': { m: 2, width: '60ch' },
                    input: {
                        background: "white"
                    }
                }}
                noValidate
                autoComplete="off"
            >
                <TextField
                    label="Collection Name"
                    variant='filled'
                    color='success'
                    onChange={(e) => { setName(e.target.value) }}
                    size='small'
                />
                <TextField
                    label="Symbol"
                    variant='filled'
                    color='success'
                    onChange={(e) => { setSymbol(e.target.value) }}
                    size='small'
                />
                <TextField
                    label="Image URL"
                    variant='filled'
                    color='success'
                    onChange={(e) => { setImageURL(e.target.value) }}
                    size='small'
                />
                    <TextareaAutosize
      maxRows={4}
      aria-label="maximum height"
      placeholder="Description"
      style={{ width: "60ch", color: 'black', height: "6ch" }}
      onChange={(e) => { setdesc(e.target.value) }}
    />              
            </Box>
            <FilePicker />  
            <br></br>
            <button className="btn btn-primary"
          type="submit" onClick={makeColl}>Add</button>
        </div>
  )
}