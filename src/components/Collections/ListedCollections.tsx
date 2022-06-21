import { useWallet } from "@solana/wallet-adapter-react";
import { FC, useCallback, useState } from "react";
import React, { useEffect } from "react";
import { notify } from "../../utils/notifications";
import {
  Metaplex,
  bundlrStorage,
  walletAdapterIdentity,
} from "@metaplex-foundation/js-next";
import { Connection, clusterApiUrl } from "@solana/web3.js";
import { Collections } from "./Collections";
import axios from "axios";
const baseURL = "http://localhost:5000";
export const ListedCollections = () => {
  let res = [];
  let Ikey = 0;
  const [collectionList, setCollectionList] = useState([]);
  const [updated, setupdated] = useState(false);
  const getCollections = async () => {
    try {
      const response = await axios(`${baseURL}/fetchAllCollection`);
      // const result = await response.json();
      console.log("Inside Fetch");
      // console.log(response.data);
      return response.data;
      let data = await response.data;
      await setCollectionList(data);
      console.log(collectionList);
    } catch (error) {
      console.log("ERROR", error);
    }
  };
  const onClick = async () => {
    res = await getCollections();
    console.log(res);
    setupdated(true);
    setCollectionList(res);
    console.log(collectionList);
  };

  useEffect(() => {
    setTimeout(() => {}, 10000);
    console.log("Exucute useEffect");
    onClick();
  }, []);

  return (
    <div>
      {/* <button
                className="group w-60 m-2 btn animate-pulse disabled:animate-none bg-gradient-to-r from-[#9945FF] to-[#14F195] hover:from-pink-500 hover:to-yellow-500 ... "
                onClick={up}
               
            >
               
                <span className="block group-disabled:hidden">Fetch NFTS</span>
            </button><br /><br /><br />
            <h1 className="text-center text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-tr from-[#9945FF] to-[#14F195]">
               Your listed collection
            </h1><br /> */}
      <div className="row">
        {collectionList.map((x) => {
          return <Collections data={x} key={Ikey++} />;
        })}
      </div>
    </div>
  );
};
