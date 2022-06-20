import { useWallet } from "@solana/wallet-adapter-react";
import { FC, useCallback, useState } from "react";
import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { notify } from "../../utils/notifications";
import {
    Metaplex,
    bundlrStorage,
    walletAdapterIdentity,
} from "@metaplex-foundation/js-next";
import { Connection, clusterApiUrl } from "@solana/web3.js";
import { Nfts } from "./Nfts";
import axios from "axios";
const baseURL = "http://localhost:5000";
export const ListedNfts = () => {
    const router = useRouter()
    const {
        query: { collectionName },
    } = router

    
    let res = [];
    let Ikey = 0;
    const [collectionList, setCollectionList] = useState([]);
    const [updated, setupdated] = useState(false);
    const getCollections = async () => {
        try {
            setTimeout(() => {

            }, 10000);
           
            const response = await axios(`${baseURL}/FetchListedNftsOfCollection/${collectionName}`);
            // const result = await response.json();
            console.log("Inside Fetch");
            console.log(response.data);
            return response.data.data;
            let data = await response.data;
            await setCollectionList(data);
            console.log(collectionList);
        } catch (error) {
            console.log('ERROR', error);
        }
    }
    const onClick = async () => {
        res = await getCollections();
        console.log("res mintkey",res);

        setupdated(true);
        setCollectionList(res);
        console.log("collectionList",collectionList);
    }

    useEffect(() => {
        setTimeout(() => {

        }, 10000);
        console.log("Exucute useEffect");
        onClick();

    }, []);
    return (

        <div>
            <img src="https://gateway.pinata.cloud/ipfs/QmYLxwKaXbuFiQm8N7FuAqUzwXz3o9tQDWB7WY2MniKL3j" className="profileimg" />
            <div className="profileName">{collectionName}</div>
            {/* <div className="profileNameB text-center text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-tr from-[#9945FF] to-[#14F195]">{userName}</div> */}
            {/* <div className="publicKey">Total Listed Nfts<br/>1000</div> */}


            <div className="row">

                {collectionList.map((x) => {
                    return <Nfts data={x} key={Ikey++} />
                })}
            </div>
        </div>



    );
};
