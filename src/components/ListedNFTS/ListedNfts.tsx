import { useWallet } from "@solana/wallet-adapter-react";
import { FC, useCallback, useState } from "react";
import { notify } from "../../utils/notifications";
import {
    Metaplex,
    bundlrStorage,
    walletAdapterIdentity,
} from "@metaplex-foundation/js-next";
import { Connection, clusterApiUrl } from "@solana/web3.js";
import { NFTS } from "./NFTS";
import  axios  from "axios";
const baseURL = "http://localhost:5100";
export const ListedNfts = () => {
    const [NFTList, setNFTList] = useState([]);



    let myNFTs;
    let indexKeys = 0;
    let arr = [];

    const onClick = () => {
        axios.get(`${baseURL}/fetchAllNfts`)
            .then(response => console.log(response))
            .catch(error => {
                console.error('There was an error!', error);
            });

    }

    // const onClick = useCallback(async () => {
    //     try {


    //         // console.log(myNFTs);
    //         // myNFTs.map(async (x) => {
    //         //     // let uri = await fetch(x.uri);
    //         //     // let res = await uri.json();
    //         //     arr.push(x);
    //         //     // console.log("name is", res.image);
    //         // });
    //         // setTimeout(() => {
    //         //     setNFTList(arr); 
    //         //   }, 1000);
    //         // console.log("NFTList is", arr);
    //     } catch (err) {
    //         console.log(err);
    //     }
    // }, [notify, connection]);

    const updateNFTs = async () => {
        await setNFTList(arr);

    }
    return (
        <div>
            <button
                className="group w-60 m-2 btn animate-pulse disabled:animate-none bg-gradient-to-r from-[#9945FF] to-[#14F195] hover:from-pink-500 hover:to-yellow-500 ... "
                onClick={onClick}
               
            >
               
                <span className="block group-disabled:hidden">Fetch NFTS</span>
            </button><br /><br /><br />
            <h1 className="text-center text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-tr from-[#9945FF] to-[#14F195]">
                Your NFTS
            </h1><br />
            <div className="row">

                {/* {NFTList.map((x) => {
                    return <NFTS data={x} key={indexKeys++} />
                })} */}
            </div>

        </div>
    );
};
