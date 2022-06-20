// import { FC } from 'react';
import { produceWithPatches } from 'immer';
import React from 'react';
import Link from "next/link";
import {
    Metaplex,
    bundlrStorage,
    walletAdapterIdentity,
} from "@metaplex-foundation/js-next";
import { Connection, clusterApiUrl,PublicKey } from "@solana/web3.js";
import {  useWallet } from "@solana/wallet-adapter-react";
import { FC, useCallback, useState } from "react";

export const Nfts = (props) => {
    console.log("props",props);
    const [image, setimage] = useState("")
    const [name, setName] = useState("")
    const [updated, setupdated] = useState(false);
    // console.log("props",props);

    const pic = async (data) => {
        console.log("data",data)
        const connection = new Connection(clusterApiUrl("devnet"));
        const { publicKey } = useWallet();
        const wallet = useWallet();
        const metaplex = Metaplex.make(connection)
            //@ts-ignore
            .use(walletAdapterIdentity(wallet))
            .use(bundlrStorage());
            const mint = new PublicKey(data);

            const nft = await metaplex.nfts().findByMint(mint);
            console.log("nftdata",nft.uri)
            let uri = await fetch(nft.uri);
            let res = await uri.json();
        if(!updated)
            setimage(res.image);
            setName(nft.name)
        setupdated(true);
        
    }
    pic(props.data.mintKey);
    
    return (
        <div className="column">
            <section className="mx-auto my-5 max_width abc">
                <div className="card">
                  <br />
                    <div>
                        <h5 className="card-title font-weight-bold mb-2 text-center">
                            {name}
                        </h5>
                    </div>
                    {/* {let abc1 = abc(props.data.uri)} */}
                   <div className="bg-image hover-overlay pd" data-mdb-rippleripple rounded-0-color="light">
                        <img className="img-fluid  max_width image_width"
                       
                         src={image}
                            alt="NFT" />

                    </div>
                    <br />
                    <p className="card-text" id="collapseContent" >
                        Price: {props.data.amount}
                    </p>
                    
                    <button  className="pd group w-60 m-2 btn animate-pulse disabled:animate-none bg-gradient-to-r from-[#9945FF] to-[#14F195] hover:from-pink-500 hover:to-yellow-500 ... "            >
                    <Link 
                              href="#"
                       
                         ><span   className="block group-disabled:hidden ">Buy</span></Link>
                        
                    </button>
                </div>
            </section>
        </div>

    );
};
