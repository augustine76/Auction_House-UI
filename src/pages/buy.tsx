import type { NextPage } from "next";
import Head from "next/head";
import  {BuyView} from "../views";

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
    
      <BuyView />
    </div>
  );
};

export default CollectionForm;