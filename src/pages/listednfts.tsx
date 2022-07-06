// @ts-nocheck

import type { NextPage } from "next";
import Head from "next/head";
import  {ListedNftsView} from "../views";

const Basics: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>SoluLab - Solana</title>
        <meta
          name="description"
          content="Basic Functionality"
        />
      </Head>
    
      <ListedNftsView />
    </div>
  );
};

export default Basics;