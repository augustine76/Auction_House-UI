import React from "react";
import cx from "clsx";
import { Card, Col, Row, Text } from "@nextui-org/react";

export const Collections = React.memo(function MusicCard(props) {
  console.log(props.collection)
  return (
    <>
      <Card css={{ w: "100%", h: "200px" }}>
        <Card.Header css={{ position: "absolute", zIndex: 1, top: 0 }}>
          <Col></Col>
        </Card.Header>
        <Card.Body css={{ p: 0 }}>
          <Card.Image
            src={props.image}
            width="100%"
            height="100%"
            objectFit="cover"
            alt="Card example background"
          />
        </Card.Body>
        <Card.Footer
          css={{
            background: "#181818",
            borderTop: "$borderWeights$light solid rgba(255, 255, 255, 0.2)",
            bottom: 0,
            zIndex: 1,
          }}
        >
          <Row>
            <Col
              css={{
                padding: "10px 0",
              }}
            >
              <Text css={{ w: "100%"}} size={12} weight="bold" transform="uppercase" color="#fff">
                {props.name}
              </Text>
              <Text color="#fff">{props.collection}</Text>
              <Text color="#fff" size={12}>
                {props.body}
              </Text>
            </Col>
          </Row>
        </Card.Footer>
      </Card>
    </>
  );
});
export default Collections;
