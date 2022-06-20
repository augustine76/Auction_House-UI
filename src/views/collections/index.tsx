import { FC } from "react";
// import { Buy } from '../../AuctionHouseComponents/Buy';
import NFTCollections from "../../components/FetchCollections";
import { Container, Row } from "@nextui-org/react";

export const CollectionsView: FC = ({}) => {
  return (
    <Container>
      <Row justify="center" align="center">
        <h1 className="text-center text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-tr from-[#9945FF] to-[#14F195]">
          NFT Collections
        </h1>
      </Row>
      {/* CONTENT GOES HERE */}
      <Row justify="center" align="center">
        <div className="text-center">
          <NFTCollections name={"Test"} />
        </div>
      </Row>
    </Container>
  );
};
