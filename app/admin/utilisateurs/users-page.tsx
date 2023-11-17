"use client";

import React from "react";
import Layout from "../../../components/Layout";
import { Alert, Center, Skeleton } from "@mantine/core";
import UserList from "../../../components/UserList";
import { getUsers } from "@/domain/User/User.webService";
import { useQuery } from "@tanstack/react-query";
import { UserWithGigCount } from "@/domain/User/User.type";

const Users = () => {
  const {
    data: users,
    error,
    isLoading,
    isError,
  } = useQuery<UserWithGigCount[], Error>({
    queryKey: ["users"],
    queryFn: async () => await getUsers(),
  });

  return (
    <Layout title="Tous les utilisateurs" withPaper>
      {isLoading && <Skeleton height={150} />}
      {users && (
        <Center maw={900} m="auto">
          <UserList users={users} />
        </Center>
      )}
      {isError && <Alert color="red">{error?.message}</Alert>}
    </Layout>
  );
};

export default Users;
