
// import React, { useEffect, useState } from "react";
// import cx from "clsx";
// import { Grid, Container, Row, Col } from "@nextui-org/react";
// import { Collections } from "./Collections";
// const axios = require("axios").default;

// const truncate = (str, n) => {
//   return str?.length > n ? str.substr(0, n - 1) + "..." : str;
// };
// const baseURL = "http://localhost:5000";

// const NFTCollections = () => {
//   let res = [];
//   let Ikey = 0;
//   const [collectionList, setCollectionList] = useState([]);
//   const [updated, setupdated] = useState(false);
//   const getCollections = async () => {
//     try {
//       const response = await axios(
//         `${baseURL}/fetchAllCollection`
//       );
//       console.log("Inside Fetch");
//       return response.data.data;
//       let data = await response.data;
//       await setCollectionList(data);
//     } catch (error) {
//       console.log("ERROR", error);
//     }
//   };

//   const fetchedNft = async () => {
//     res = await getCollections();
//     setupdated(true);
//     setCollectionList(res);
//     console.log(collectionList);
//   };

//   useEffect(() => {
//     fetchedNft()
//   }, [])


//   return (
//     <div>
//       {/* <button
//         className="group w-60 m-2 btn animate-pulse disabled:animate-none bg-gradient-to-r from-[#9945FF] to-[#14F195] hover:from-pink-500 hover:to-yellow-500 ... "
//         onClick={fetchedNft}
//         // disabled={!publicKey}
//       >
//         <div className="hidden group-disabled:block ">Wallet not connected</div>
//         <span className="block group-disabled:hidden">Fetch NFTS</span>
//       </button> */}
//       <Container gap={0}>
//         <Row gap={0}>
//           <Grid.Container gap={2} justify="center">
//             {updated ? (
//               collectionList.map((x) => {
//                 return (
//                   <Grid xs={12} md={2} lg={2}>
//                     <Collections
//                       name={truncate(x.name, 8)}
//                       collection={truncate(x.symbol, 6)}
//                       image={x.image}
//                       key={Ikey++}
//                       body={truncate(x.description, 10)}
//                     />
//                   </Grid>
//                 );
//               })
//             ) : (
//               <>
//                 <h1>not updated</h1>
//               </>
//             )}
//           </Grid.Container>
//         </Row>
//       </Container>
//     </div>
//   );
// };
// export default NFTCollections;




























import React, { useEffect, useState } from "react";
import cx from "clsx";
import { Grid, Container, Row, Col } from "@nextui-org/react";
import { Collections } from "./Collections";
const axios = require("axios").default;

const truncate = (str, n) => {
  return str?.length > n ? str.substr(0, n - 1) + "..." : str;
};

const NFTCollections = () => {
  let res = [];
  let Ikey = 0;
  const [collectionList, setCollectionList] = useState([]);
  const [updated, setupdated] = useState(false);
  const getCollections = async () => {
    try {
      const response = await axios(
        "https://api-mainnet.magiceden.dev/v2/collections?offset=0&limit=30"
      );
      console.log("Inside Fetch");
      return response.data;
      let data = await response.data;
      await setCollectionList(data);
    } catch (error) {
      console.log("ERROR", error);
    }
  };

  const fetchedNft = async () => {
    res = await getCollections();
    setupdated(true);
    setCollectionList(res);
    console.log(collectionList);
  };

  useEffect(() => {
    fetchedNft()
  }, [])


  return (
    <div>
      {/* <button
        className="group w-60 m-2 btn animate-pulse disabled:animate-none bg-gradient-to-r from-[#9945FF] to-[#14F195] hover:from-pink-500 hover:to-yellow-500 ... "
        onClick={fetchedNft}
        // disabled={!publicKey}
      >
        <div className="hidden group-disabled:block ">Wallet not connected</div>
        <span className="block group-disabled:hidden">Fetch NFTS</span>
      </button> */}
      <Container gap={0}>
        <Row gap={0}>
          <Grid.Container gap={2} justify="center">
            {updated ? (
              collectionList.map((x) => {
                return (
                  <Grid xs={12} md={2} lg={2}>
                    <Collections
                      name={truncate(x.name, 8)}
                      collection={truncate(x.symbol, 6)}
                      image={x.image}
                      key={Ikey++}
                      body={truncate(x.description, 10)}
                    />
                  </Grid>
                );
              })
            ) : (
              <>
                <h1>not updated</h1>
              </>
            )}
          </Grid.Container>
        </Row>
      </Container>
    </div>
  );
};
export default NFTCollections;
