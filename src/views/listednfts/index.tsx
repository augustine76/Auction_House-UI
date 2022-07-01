import { FC } from "react";
import { ListedNfts } from "../../components/Collections/ListedNfts";
import { Container, Row } from "@nextui-org/react";
export const ListedNftsView: FC = ({}) => {
  return (
    <>
      <Container>
        <Row justify="center" align="center">
          {/* <h1 className="text-center text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-tr from-[#9945FF] to-[#14F195]">
            Listed NFTS
          </h1> */}
        </Row>
        <Row justify="center" align="center">
          <ListedNfts />
        </Row>
      </Container>
    </>
  );
};
