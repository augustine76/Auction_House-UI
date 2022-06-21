import React, { useEffect, useState } from "react";
import { Grid, Container, Row } from "@nextui-org/react";
import { Collections } from "../Collections";

const axios = require("axios").default;
const truncate = (str, n) => {
  return str?.length > n ? str.substr(0, n - 1) + "..." : str;
};

export const UserNFT = (props: any) => {
  let res = [];
  let Ikey = 0;
  const [collectionList, setCollectionList] = useState([]);
  const [updated, setupdated] = useState(false);

  const getCollections = async () => {
    try {
      const response = await axios(
        "https://api-mainnet.magiceden.dev/v2/collections?offset=0&limit=30"
      );
      console.log("Inside Fetch");
      return response.data;
      let data = await response.data;
      await setCollectionList(data);
    } catch (error) {
      console.log("ERROR", error);
    }
  };

  const fetchedNft = async () => {
    res = await getCollections();
    setupdated(true);
    setCollectionList(res);
    console.log(collectionList);
  };

  useEffect(() => {
    fetchedNft();
  }, []);

  return (
    <div>
      <Container gap={0}>
          <p>{props.type}</p>
        <Row gap={0}>
          <Grid.Container gap={2} justify="center">
            {updated ? collectionList.map((x) => {
              return (
                <Grid xs={12} md={2} lg={2}>
                  <Collections
                    name={truncate(x.name, 8)}
                    collection={truncate(x.symbol, 6)}
                    image={x.image}
                    key={Ikey++}
                    body={truncate(x.description, 10)}
                  />
                </Grid>
              );
            }) : "not Updated"}
          </Grid.Container>
        </Row>
      </Container>
    </div>
  );
};
