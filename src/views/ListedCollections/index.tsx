import { FC } from "react";
import { SignMessage } from "../../components/SignMessage";
import { FetchNFTS } from "../../components/FetchNFTS";
import { Container, Row } from "@nextui-org/react";
import { ListedCollections } from "../../components/Collections/ListedCollections";
export const ListedCollectionsView: FC = ({}) => {
  return (
    <>
      <Container>
        <Row  justify="center" align="center">
          <h1 className="text-center text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-tr from-[#9945FF] to-[#14F195]">
            Listed NFT Collections
          </h1>
        </Row>
        <Row>
          <div className="text-center">
            <ListedCollections />
          </div>
        </Row>
      </Container>
    </>
  );
};
