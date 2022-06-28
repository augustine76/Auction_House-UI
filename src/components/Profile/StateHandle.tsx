import React, { useEffect, useState } from "react";
import {UserNFT} from "./UserListedNFTS/ListedCollection"
import{UserOwnedCollection} from "./UserOwnedNFTS/OwnedCollection"
const truncate = (str, n) => {
  return str?.length > n ? str.substr(0, n - 1) + "..." : str;
};



export const StateHandle = (props: any) => {
  
  console.log("props", props)
  
  
  return (
    <div>
       
        {props.type=="Listed NFTs" ? <UserNFT/> : (props.type=="Owned NFTs"? <UserOwnedCollection/> : "collection")}
     
    </div>
  );
};
