// import { FC } from 'react';
import { produceWithPatches } from 'immer';
import React from 'react';

export const NFTDetails = (props) => {
    console.log("nft details",props)
    return (
        <div className="column">



            <section className="mx-auto my-5 max_width abc">

                <div className="card">

                    <br />

                    <div>
                        <h5 className="card-title font-weight-bold mb-2 text-center">abc</h5>
                    </div>

                    <div className="bg-image hover-overlay pd" data-mdb-rippleripple rounded-0-color="light">
                        <img className="img-fluid  max_width image_width" 
                            alt="Card image cap" />

                    </div>
                    <br />
                    <p className="card-text" id="collapseContent" >
                        ABC
                    </p>
                    <button className="pd group w-60 m-2 btn animate-pulse disabled:animate-none bg-gradient-to-r from-[#9945FF] to-[#14F195] hover:from-pink-500 hover:to-yellow-500 ... "            >

                        <span className="block group-disabled:hidden ">Sell</span>
                    </button>


                </div>


            </section>


        </div>

    );
};
