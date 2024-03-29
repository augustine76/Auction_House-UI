// @ts-nocheck
import { FC } from "react";
import { Container, Row } from "@nextui-org/react";
import { ListedCollections } from "../../components/Collections/ListedCollections";
import { RequestAirdrop } from "components/RequestAirdrop";
import { SignMessage } from "components/SignMessage";
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
          <ListedCollections />
          <RequestAirdrop />
          <SignMessage />
        </div>
      </Row>
    </Container>
  );
};
