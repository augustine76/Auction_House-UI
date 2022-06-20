import { FC } from "react";
import { ExecuteSell } from "../../AuctionHouseComponents/ExecuteSell";
import { Container, Row, Col } from "@nextui-org/react";


export const ExecuteView: FC = ({}) => {
  return (
    <Container>
      <Row justify="center" align="center">
        <h1 className="text-center text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-tr from-[#9945FF] to-[#14F195]">
          Execute Sell
        </h1>
      </Row>
      <Row justify="center" align="center">
        {/* CONTENT GOES HERE */}
        <div className="text-center">
          <ExecuteSell />
        </div>
      </Row>
    </Container>
  );
};
