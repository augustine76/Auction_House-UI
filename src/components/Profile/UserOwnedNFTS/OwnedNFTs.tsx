import React, { useEffect, useState } from "react";

const axios = require("axios").default;
import { useWallet } from "@solana/wallet-adapter-react";
import { NFTS } from "./NFTS";
import { Grid, Container, Row } from "@nextui-org/react";

const baseURL = "http://localhost:5100";

export const UserOwnedNFTs = (props) => {
  let res = [];
  let Ikey = 0;
  const [NFTList, setNFTList] = useState([]);
  const [updated, setupdated] = useState(false);
  console.log("props", props);
  const { publicKey } = useWallet();

  const getListedNFTS = async () => {
    try {
      console.log("abc", publicKey.toBase58());
      const owner = publicKey.toBase58();
      const response = await axios
        .post(`${baseURL}/FetchOwnedNFTsInCollection`, {
          owner: owner,
          collectionName: props.data,
        })
        .then((res) => {
          return res;
        });
      console.log("collectionList", response);

      console.log("abc final f", response);
      return response.data;
    } catch (error) {
      console.log("ERROR 2", error);
    }
  };
  const fetchedNft = async () => {
    res = await getListedNFTS();

    console.log("res f", res);
    setupdated(true);
    setNFTList(res);
    console.log("collection", NFTList);
  };

  useEffect(() => {
    setTimeout(() => {}, 10000);

    fetchedNft();
  }, []);
  return (
    <>
      <Container gap={0}>
        <p>{props.type}</p>
        <Row gap={0}>
          <Grid.Container gap={2} justify="center">
            {NFTList.map((x) => {
              return (
                <>
                  <Grid xs={12} md={2} lg={2}>
                    <NFTS mintKey={x.mintKey} price={x.price} />
                  </Grid>
                </>
              );
            })}
          </Grid.Container>
        </Row>
      </Container>
    </>
  );
};
