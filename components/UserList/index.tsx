"use client";

import React from "react";
import { User } from "@prisma/client";
import { Text } from "@mantine/core";

type Props = {
  users: User[];
};

export default function UserList({ users }: Props) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr 1fr",
        gap: 20,
      }}
    >
      {users.map((user) => (
        <div
          key={user.id}
          style={{ border: "1px solid #ccc", textAlign: "center" }}
        >
          <Text>{user.pseudo}</Text>
          <Text>{user.email}</Text>
        </div>
      ))}
    </div>
  );
}
