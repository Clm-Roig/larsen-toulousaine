"use client";

import React from "react";
import Layout from "../../../components/Layout";
import { Box, Title } from "@mantine/core";
import UserList from "../../../components/UserList";
import { User } from "@prisma/client";

type Props = {
  users: User[];
};

const Users = ({ users }: Props) => {
  return (
    <Layout>
      <Title order={2}>Tous les utilisateurs</Title>
      <Box p="sm">
        <UserList users={users} />
      </Box>
    </Layout>
  );
};

export default Users;
