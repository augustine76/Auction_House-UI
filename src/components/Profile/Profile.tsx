// import { FC } from 'react';
import React from "react";
import { UserDetails } from "./UserDetails";
import { UserItems } from "../UserItems";
import { Container, Row } from "@nextui-org/react";

export const Profile = () => {
  return (
    <Container>
      <Row justify="center" align="center">
        <UserDetails />
      </Row>
      {/* <Row justify="center" align="center">
        <UserItems />
      </Row> */}
    </Container>
  );
};
