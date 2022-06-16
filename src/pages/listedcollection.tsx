import type { NextPage } from "next";
import Head from "next/head";

 import{ListedCollectionsView} from "../views";
const ListedCollections: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>Execute Sale</title>
        <meta
          name="description"
          content="Basic Functionality"
        />
      </Head>
    
      <ListedCollectionsView />
    </div>
  );
};

export default ListedCollections;