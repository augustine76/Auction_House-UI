// @ts-nocheck

import type { NextPage } from "next";
import Head from "next/head";
import  {ProfileView} from "../views";

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
    
      <ProfileView />
    </div>
  );
};

export default Basics;