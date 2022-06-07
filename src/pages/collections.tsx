import type { NextPage } from "next";
import Head from "next/head";
import  { CollectionsView } from "../views";
 
const Collections: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>Execute Sale</title>
        <meta
          name="description"
          content="Basic Functionality"
        />
      </Head>
    
      <CollectionsView />
    </div>
  );
};

export default Collections;