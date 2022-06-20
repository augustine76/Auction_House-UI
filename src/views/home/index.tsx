import { FC } from "react";
import { Container, Row } from "@nextui-org/react";
import { GetAuctionHouse } from "../../AuctionHouseComponents/GetAuctionHouse";
import NFTCollections from "../../components/FetchCollections";
import { Verify } from "../../AuctionHouseComponents/verifyCollection";
export const HomeView: FC = ({}) => {
  return (
    <Container>
      <Row justify="center" align="center">
        <h1 className=" text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-tr from-[#9945FF] to-[#14F195]">
          Auction House
        </h1>
      </Row>
      <Row justify="center" align="center">
        <div className="text-center">
          <NFTCollections />
          {/* <GetAuctionHouse />
          <Verify /> */}
        </div>
      </Row>
    </Container>
  );
};
