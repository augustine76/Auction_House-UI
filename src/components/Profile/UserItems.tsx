// import { FC } from 'react';

// import React from 'react';

// export const UserItems = () => {

//     return (
//         <div>
//             MyNFTS
//         </div>

//     );
// };

import React, { useEffect } from "react";
import { FC, useCallback, useState } from "react";
import { notify } from "../../utils/notifications";
import { useWallet } from "@solana/wallet-adapter-react";
import {
    Metaplex,
    bundlrStorage,
    walletAdapterIdentity,
} from "@metaplex-foundation/js-next";
import { Connection, clusterApiUrl } from "@solana/web3.js";
import { NFTS } from "./NFTS";

export const UserItems = () => {
    const [NFTList, setNFTList] = useState([]);

    const connection = new Connection(clusterApiUrl("devnet"));

    let myNFTs;
    let indexKeys = 0;
    let arr = [];


    const { publicKey } = useWallet();
    const wallet = useWallet();
    const metaplex = Metaplex.make(connection)
        //@ts-ignore
        .use(walletAdapterIdentity(wallet))
        .use(bundlrStorage());

    const onClick = useCallback(async () => {
        try {
            myNFTs = await metaplex
                .nfts()
                .findAllByOwner(metaplex.identity().publicKey);

            console.log(myNFTs);
            myNFTs.map(async (x) => {
                // let uri = await fetch(x.uri);
                // let res = await uri.json();
                arr.push(x);
                // console.log("name is", res.image);
            });
            setTimeout(() => {
                setNFTList(arr);
            }, 1000);
            console.log("NFTList is", arr);
        } catch (err) {
            console.log(err);
        }
    }, [notify, connection]);

    const updateNFTs = async () => {
        await setNFTList(arr);

    }
    useEffect(() => {
        setTimeout(() => {

        }, 10000);
        console.log("Exucute useEffect");
        onClick();

    }, []);

    return (
        <div>
            MyNFTS
            <div className="row">
 
                { NFTList.map((x) => {
                    return <NFTS data={x} key={indexKeys++} />
                })}
            </div>
        </div>
    );
}
