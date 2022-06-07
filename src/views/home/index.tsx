
import { FC } from "react";
// import { SignMessage } from '../../components/SignMessage';
// import { CreateNFTS } from '../../components/CreateNFTS';
// import { FetchNFTS} from '../../components/FetchNFTS';
import { CreateAuctionHouse } from '../../AuctionHouseComponents/CreateAuctionHouse';
import { Sell } from '../../AuctionHouseComponents/Sell';
import { GetAuctionHouse } from '../../AuctionHouseComponents/GetAuctionHouse';
import { ExecuteSell } from '../../AuctionHouseComponents/ExecuteSell';
import { Buy } from '../../AuctionHouseComponents/Buy';
import { Cancel} from '../../AuctionHouseComponents/Cancel';
import {Deposit} from '../../AuctionHouseComponents/Deposit';
import {Withdraw} from '../../AuctionHouseComponents/Withdraw';
import NFTCollections from '../../components/FetchCollections';
import Collections from "../../components/Collections";
export const HomeView: FC = ({ }) => {

  // const mystyle = {
  //   display: "flex",
  //   flex-direction: "row",
  // };

  return (
    <div className="md:hero mx-auto p-4">
      <div className="md:hero-content flex flex-col">
        <h1 className="text-center text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-tr from-[#9945FF] to-[#14F195]">
          Auction House
        </h1>
        {/* CONTENT GOES HERE */}
        <div className="text-center">

          {/* <CreateAuctionHouse />
          <Deposit/>
          <Withdraw/>
          <GetAuctionHouse /> */}
          {/* <Sell />
          <Buy />
          <ExecuteSell /> */}
          <div style={{display:"flex", "flexDirection":"row", "flexWrap": "wrap",
           "justifyContent":"space-between"}}>
          <NFTCollections />
          {/* <NFTCollections />
          <NFTCollections />

          <Collections />
          <Collections />
          <Collections /> */}


          </div>



        </div>
      </div>
    </div>
  );
};
