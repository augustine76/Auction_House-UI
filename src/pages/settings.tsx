import type { NextPage } from "next";
import Head from "next/head";
import  { SettingsView } from "../views";
 
const Settings: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>Settings</title>
        <meta
          name="description"
          content="Basic Functionality"
        />
      </Head>
    
      <SettingsView />
    </div>
  );
};

export default Settings;