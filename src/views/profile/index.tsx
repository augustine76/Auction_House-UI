import { FC } from "react";
import { Container, Row } from "@nextui-org/react";
import { Profile } from "../../components/Profile/Profile";
import { TabGroup } from "../../components/Profile/TabGroups"

export const ProfileView: FC = ({}) => {
  return (
    <>
      <Container>
        <Row justify="center" align="center">
          <Profile />
        </Row>
        <Row justify="center" align="center">
          <TabGroup/>
        </Row>
      </Container>
    </>
  );
};
