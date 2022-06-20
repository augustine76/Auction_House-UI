import type { NextPage } from "next";
import Head from "next/head";
import  { CollectionsView } from "../views";
 
const Collection: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>Single Collection </title>
        <meta
          name="description"
          content="Basic Functionality"
        />
      </Head>
    
      <CollectionsView />
    </div>
  );
};

export default Collection;