"use client";

import React from "react";
import Layout from "../../../components/Layout";
import { Box, Title } from "@mantine/core";
import { User } from "@prisma/client";
import UserList from "../../../components/UserList";

type Props = {
  users: User[];
};

const Users = ({ users }: Props) => {
  return (
    <Layout>
      <div className="page">
        <Title order={2}>Tous les utilisateurs</Title>
        <main>
          <Box p="sm">
            <UserList users={users} />
          </Box>
        </main>
      </div>
    </Layout>
  );
};

export default Users;
