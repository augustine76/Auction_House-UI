import { FC } from "react";
import { CollectionForm } from "../../components/Profile/AddCollection";
import { Container, Row } from "@nextui-org/react";

export const CollectionFormView: FC = ({}) => {
  return (
    <>
      <Container>
        <Row justify="center" align="center">
          <h1 className="text-center text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-tr from-[#9945FF] to-[#14F195]">
            Add Collection
          </h1>
        </Row>
        <Row justify="center" align="center">
            <CollectionForm />
        </Row>
      </Container>
    </>
  );
};
