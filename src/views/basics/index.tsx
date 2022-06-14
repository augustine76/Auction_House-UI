
import { FC } from "react";
import { SignMessage } from '../../components/SignMessage';

import { FetchNFTS} from '../../components/FetchNFTS';
import {SignMessage2} from '../../components/SignMessagecopy'
export const BasicsView: FC = ({ }) => {

  return (
<div className="md:hero mx-auto p-4">
      <div className="md:hero-content flex flex-col">
        <h1 className="text-center text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-tr from-[#9945FF] to-[#14F195]">
          NFTs
        </h1>
        {/* CONTENT GOES HERE */}
        <div className="text-center">
          <SignMessage/>
          <SignMessage2/>
          <FetchNFTS />
        </div>
      </div>
    </div>
  );
};
