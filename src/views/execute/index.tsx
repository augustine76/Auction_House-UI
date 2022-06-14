
import { FC } from "react";
import { ExecuteSell } from '../../AuctionHouseComponents/ExecuteSell';
export const ExecuteView: FC = ({ }) => {

return (
<div className="md:hero mx-auto p-4">
      <div className="md:hero-content flex flex-col">
        <h1 className="text-center text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-tr from-[#9945FF] to-[#14F195]">
          Execute Sell
        </h1>
        {/* CONTENT GOES HERE */}
        <div className="text-center">
            <ExecuteSell />
        </div>
      </div>
    </div>
  );
};
