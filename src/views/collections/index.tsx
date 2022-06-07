
import { FC } from "react";
import { SignMessage } from '../../components/SignMessage';
import { FetchNFTS} from '../../components/FetchNFTS';
// import { Buy } from '../../AuctionHouseComponents/Buy';
import NFTCollections  from "../../components/FetchCollections";
export const CollectionsView: FC = ({ }) => {

return (
<div className="md:hero mx-auto p-4">
      <div className="md:hero-content flex flex-col">
        <h1 className="text-center text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-tr from-[#9945FF] to-[#14F195]">
          NFT Collections
        </h1>
        {/* CONTENT GOES HERE */}
        <div className="text-center">
            <NFTCollections name={"Test"} />
        </div>
      </div>
    </div>
  );
};
