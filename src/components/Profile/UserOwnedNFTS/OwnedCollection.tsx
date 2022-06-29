
import React, { useEffect, useState } from "react";
import { Grid, Col, Row, Text } from "@nextui-org/react";
// import { Collections } from "../../Collections";
import { useWallet } from "@solana/wallet-adapter-react";
const axios = require("axios").default;
const truncate = (str, n) => {
  return str?.length > n ? str.substr(0, n - 1) + "..." : str;
};
import {
  Metaplex,
  bundlrStorage,
  walletAdapterIdentity,
} from "@metaplex-foundation/js-next";
import { Connection, clusterApiUrl, PublicKey } from "@solana/web3.js";
import { UserOwnedNFTs } from "./OwnedNFTs";
const baseURL = "http://localhost:5100";

let collectionNames = [];

export const UserOwnedCollection = (props: any) => {
  let res = [];
  let Ikey = 0;
  const [NFTList, setNFTList] = useState([]);
  const [updated, setupdated] = useState(false);
  console.log("props", props);
  const { publicKey } = useWallet();

  const getCollections = async () => {
    try {
      console.log("abc", publicKey.toBase58());
      const owner = publicKey.toBase58();
      const response = await axios

        .post(`${baseURL}/FetchCollectionsByAddress`, { owner: owner ,inSale:false})

        .then((res) => {
          return res.data;
        });

      return response;
    } catch (error) {
      console.log("ERROR", error);
    }
  };

  const fetchedNft = async () => {
    res = await getCollections();

    try {
      res.map((x) => {
        if (collectionNames.indexOf(x.collectionName) == -1) {
          collectionNames.push(x.collectionName);
        }
      });
      console.log("collection list 2", collectionNames);
      console.log("res", res);
      setupdated(true);
      setNFTList(res);
    } catch {}
    console.log("collection", NFTList);
  };
  const [collectionImage, setCollectionImage] = useState("");
  const [floorPrice, setFloorPrice] = useState(0);
  const [tradingVolume, setTradingVolume] = useState(0);
  const getCollectionInfo = async (collectionName) => {
    try {
      const response = await axios(
        `${baseURL}/getCollectionInfo/${collectionName}`
      );

      console.log("Inside Fetch");
      console.log(response.data);
      setCollectionImage(response.data.data.image);
      setFloorPrice(response.data.data.floorPrice);

      setTradingVolume(response.data.data.tradingVolume);
    } catch (error) {
      console.log("ERROR", error);
    }

  };

  useEffect(() => {
    fetchedNft();
  }, []);

  return (

    <>
      {updated && collectionNames
        ? collectionNames.map((nft) => {
          getCollectionInfo(nft)
            return (
              <>
                <Row
                  gap={1}
                  css={{
                    borderBottom: "1px solid #fff",
                    padding: "16px 0 8px 0 ",
                  }}
                >
                  <Col span={1}>
                  <Card.Image
                    src={collectionImage}

                    width="40%"
                    height="40%"
                    objectFit="cover"
                             alt="Card example background"
                  /></Col>

                  <Col span={1}>
                    <Text color="#ffffff">
                      {nft}
                      {"   "}
                    </Text>
                  </Col>
                  <Col span={1}>
                    <Text>
                      <code
                        style={{
                          color: "#ff4ecd",
                          background: "#363636",
                          padding: "5px",
                          borderRadius: "5px",
                        }}
                      >
                        Floor Price :{floorPrice}
                      </code>
                    </Text>
                  </Col>
                  <Col span={2}>
                    <Text>
                      <code
                        style={{
                          color: "#0072f5",
                          background: "#363636",
                          padding: "5px",
                          borderRadius: "5px",
                        }}
                      >
                        Trade Volume:{tradingVolume}
                      </code>
                    </Text>
                  </Col>
                </Row>
                <Row>
                <UserOwnedNFTs data={nft} />
                 
                </Row>
              </>
              // </Row>
            );
          })
        : "not Updated"}

      {/* </Grid.Container> */}
    </>

  );
};
