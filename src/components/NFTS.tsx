// import { FC } from 'react';
import { produceWithPatches } from 'immer';
import React, { useState } from 'react';
import Link from "next/link";

export const NFTS = (props) => {
    const [image, setimage] = useState("")
    const [updated, setupdated] = useState(false);
    // console.log("props",props);
    const pic = async (data) => {
        let uri = await fetch(data);
        let res = await uri.json();
        // console.log("Res", res.image);
        if(!updated)
            setimage(res.image);
        setupdated(true);
        
    }
    pic(props.data.uri);
    // const test = (data) => {
    //     let res = abc(data);
    //     console.log("res", res)
    //     return res;
    // }
    
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
                       
                         src={image}
                            alt="NFT" />
                            {/* {
                                
                                    abc(props.data.uri).then((x) => {
                                        return(
                                            <img className="img-fluid  max_width image_width"
                       
                                                src={x}
                                                 alt="NFT" />
                                        )
                                    })
                                
                            } */}

                    </div>
                    <br />
                    <p className="card-text" id="collapseContent" >
                        {props.data.mint.toBase58()}
                    </p>
                    <button  className="pd group w-60 m-2 btn animate-pulse disabled:animate-none bg-gradient-to-r from-[#9945FF] to-[#14F195] hover:from-pink-500 hover:to-yellow-500 ... "            >

                        <Link 
                              href={{
                                pathname: "/nftdetails",
                                query: { mint: props.data.mint.toString(), uri: props.data.uri},
                              }}
                       
                         ><span className="block group-disabled:hidden ">Sell</span></Link>
                    </button>


                </div>


            </section>


        </div>

    );
};
