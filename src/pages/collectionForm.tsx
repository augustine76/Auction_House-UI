// @ts-nocheck
import type { NextPage } from "next";
import Head from "next/head";
import  {CollectionFormView} from "../views";

const CollectionForm: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>SoluLab - Solana</title>
        <meta
          name="description"
          content="Basic Functionality"
        />
      </Head>
    
      <CollectionFormView />
    </div>
  );
};

export default CollectionForm;