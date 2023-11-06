"use client";

import React from "react";
import Layout from "../../../components/Layout";
import { Alert, Skeleton, Title } from "@mantine/core";
import UserList from "../../../components/UserList";
import { getUsers } from "@/domain/User/User.webService";
import { useQuery } from "react-query";
import { User } from "@prisma/client";

const Users = () => {
  const {
    data: users,
    error,
    isLoading,
    isError,
  } = useQuery<User[], Error>({
    queryKey: ["users"],
    queryFn: async () => await getUsers(),
  });
  return (
    <Layout withPaper>
      <Title order={2}>Tous les utilisateurs</Title>
      {isLoading && <Skeleton height={150} />}
      {users && <UserList users={users} />}
      {isError && <Alert color="red">{error?.message}</Alert>}
    </Layout>
  );
};

export default Users;
