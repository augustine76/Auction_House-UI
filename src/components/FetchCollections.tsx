import React, { useState } from 'react';
import cx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import TextInfoContent from '@mui-treasury/components/content/textInfo';
import { useFourThreeCardMediaStyles } from '@mui-treasury/styles/cardMedia/fourThree';
import { useN04TextInfoContentStyles } from '@mui-treasury/styles/textInfoContent/n04';
import { useOverShadowStyles } from '@mui-treasury/styles/shadow/over';
import { Collections } from "./Collections";
import Grid from '@mui/material/Grid';
const axios = require('axios').default;

const truncate = (str, n) => {
  return str?.length > n ? str.substr(0, n - 1) + "..." : str;
};

const NFTCollections = () => { 

  let res = [];
  let Ikey = 0;
  const [collectionList, setCollectionList] = useState([]);
  const [updated, setupdated] = useState(false);
  const getCollections = async () => { 
    try {
        const response = await axios("https://api-mainnet.magiceden.dev/v2/collections?offset=0&limit=30");
        // const result = await response.json();
        console.log("Inside Fetch");
        // console.log(response.data);
        return response.data;
        let data = await response.data;
        await setCollectionList(data);
        console.log(collectionList);
    } catch (error) {
        console.log('ERROR', error);
    }
  }
  const up = async() => { 
    res = await getCollections();
    console.log(res);
    setupdated(true);
    setCollectionList(res);
    console.log(collectionList);
  }  
  // getCollections();
  const parentStyles = {
      "display": "flex",
      "flexWrap": "wrap",
      "justifyContent": "center"
  }

  return(
    <div>
            <button
                className="group w-60 m-2 btn animate-pulse disabled:animate-none bg-gradient-to-r from-[#9945FF] to-[#14F195] hover:from-pink-500 hover:to-yellow-500 ... "
                onClick={up}
                // disabled={!publicKey}
            >
                <div className="hidden group-disabled:block ">
                    Wallet not connected
                </div> 
                <span className="block group-disabled:hidden">Fetch NFTS</span>
            </button>
        <div style={{"display":"flex", "flexDirection":"row", "flexWrap": "wrap",
            "justifyContent":"space-between", "margin": "10px"}}>
        {
        updated? 

        collectionList.map((x) => {
          return(
            // <h1>
            //   {x.name}
            // </h1>
            <div 
            >
              <Collections name={truncate(x.name,8)} collection={truncate(x.symbol,6)} image={x.image} key={Ikey++} body={truncate(x.description, 10)}/>
            </div>
          )
        })
      
        :
        <>
        <h1>not updated</h1>
        </>
        }
        </div>
    </div>
    // <h1>Collections</h1>

    
  )
}
export default NFTCollections;