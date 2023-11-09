"use client";

import React from "react";
import Layout from "../../../components/Layout";
import { Alert, Skeleton } from "@mantine/core";
import UserList from "../../../components/UserList";
import { getUsers } from "@/domain/User/User.webService";
import { User } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

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
    <Layout title="Tous les utilisateurs" withPaper>
      {isLoading && <Skeleton height={150} />}
      {users && <UserList users={users} />}
      {isError && <Alert color="red">{error?.message}</Alert>}
    </Layout>
  );
};

export default Users;
