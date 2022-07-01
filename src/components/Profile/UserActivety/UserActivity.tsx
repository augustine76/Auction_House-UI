import { Table, useAsyncList } from "@nextui-org/react";
import axios from "axios";
import { useWallet } from "@solana/wallet-adapter-react";
const baseURL = "http://localhost:5100";
export default function UserActivity() {
  const columns = [
    { name: "MintKey", uid: "mintKey" },
    { name: "Type", uid: "type" },
    { name: "Buyer", uid: "buyer" },
    { name: "Seller", uid: "seller" },
    { name: "PriceAmount", uid: "priceAmount" },
    { name: "TransctionID", uid: "transactionId" },
    { name: "Timestemp", uid: "timeStamp" },
  ];
  const { publicKey } = useWallet();
  async function load({ signal, cursor }) {
    // If no cursor is available, then we're loading the first page.
    // Otherwise, the cursor is the next URL to load, as returned from the previous page.


   const res2= await axios
        .get(`${baseURL}/getUserDetails/${publicKey}`)
        .then((response) => {
          console.log("user details", response);
          // console.log("pub key", response.data.data.publicKey);
          return response.data.data.activity;
        })
        .catch((error) => {
          console.error("There was an error!", error);
        });
        console.log(res2)


    const res = await fetch(
      cursor || "https://swapi.py4e.com/api/people/?search=",
      { signal }
    );
    const json = await res.json();
    console.log("json",json);
    return {
      items: res2,
      // cursor: json.next,
    };
  }
  const list = useAsyncList({ load });
  return (
    <Table
      lined
      headerLined
      shadow={false}
      aria-label="Example table with dynamic content & infinity pagination"
      css={{ minWidth: "100%", height: "calc($space$14 * 10)" }}
      color="secondary"
    >
      <Table.Header columns={columns}>
        {(column) => (
          <Table.Column key={column.uid}>{column.name}</Table.Column>
        )}
      </Table.Header>
      <Table.Body
        items={list.items}
        loadingState={list.loadingState}
        onLoadMore={list.loadMore}
      >
        {(item) => (
          <Table.Row key={item}>
            {(key) => (
              <Table.Cell css={{ color: "#fff" }}>{item[key]}</Table.Cell>
            )}
          </Table.Row>
        )}
      </Table.Body>
    </Table>
  );
}
