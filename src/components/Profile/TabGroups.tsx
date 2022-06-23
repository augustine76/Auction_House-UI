import React, { useState } from "react";
import { Button, Container, Row, Text } from "@nextui-org/react";
import { StateHandle } from "./StateHandle";

const types = ["Listed NFTs", "Owned NFTs", "Collection", "Unverified"];

export const TabGroup = () => {
  const [active, setActive] = useState(types[0]);
  return (
    <>
      <Container>
        <Row justify="center" align="center">
          <Button.Group color="gradient" ghost>
            {types.map((type) => (
              <Button key={type} onClick={() => setActive(type)}>
                {type}
              </Button>
            ))}
          </Button.Group>
        </Row>
        <Row justify="center" align="center">
          <StateHandle type={active}/>
        </Row>
      </Container>
    </>
  );
};
