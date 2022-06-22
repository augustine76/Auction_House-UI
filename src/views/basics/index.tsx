import { FC } from "react";
import { SignMessage } from "../../components/SignMessage";
import { FetchNFTS } from "../../components/FetchNFTS";
// import { SignMessage2 } from "../../components/SignMessagecopy";
import { Container, Row } from "@nextui-org/react";


export const BasicsView: FC = ({}) => {
  return (
    <Container>
        <Row justify="center" align="center">
        <h1 className="text-center text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-tr from-[#9945FF] to-[#14F195]">
          NFTs
        </h1>
        </Row>
        {/* CONTENT GOES HERE */}
        <Row justify="center" align="center">
          <SignMessage />
          {/* <SignMessage2 /> */}
        </Row>
        <Row justify="center" align="center">
          <FetchNFTS />
        </Row>
    </Container>
  );
};
