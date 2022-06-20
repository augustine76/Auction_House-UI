// import { FC } from 'react';
import { produceWithPatches } from 'immer';
import React from 'react';
import Link from "next/link";

export const Collections = (props) => {
    console.log("props",props);
    
    
    return (
        <div className="column">
            <section className="mx-auto my-5 max_width abc">
                <div className="card">
                  <br />
                    <div>
                        <h5 className="card-title font-weight-bold mb-2 text-center">
                            {props.data.name}
                        </h5>
                    </div>
                    {/* {let abc1 = abc(props.data.uri)} */}
                   <div className="bg-image hover-overlay pd" data-mdb-rippleripple rounded-0-color="light">
                        <img className="img-fluid  max_width image_width"
                       
                         src="https://gateway.pinata.cloud/ipfs/QmYLxwKaXbuFiQm8N7FuAqUzwXz3o9tQDWB7WY2MniKL3j"
                            alt="NFT" />

                    </div>
                    <br />
                    <p className="card-text" id="collapseContent" >
                        {props.data.description}
                    </p>
                    
                    <button  className="pd group w-60 m-2 btn animate-pulse disabled:animate-none bg-gradient-to-r from-[#9945FF] to-[#14F195] hover:from-pink-500 hover:to-yellow-500 ... "            >
                    <Link 
                              href={{
                                pathname: "/listednfts",
                                query: { collectionName: props.data.name},
                              }}
                       
                         ><span   className="block group-disabled:hidden ">Go to NFTS</span></Link>
                        
                    </button>
                </div>
            </section>
        </div>

    );
};
