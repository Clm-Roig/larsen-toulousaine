"use client";

import React from "react";
import { Table } from "@mantine/core";
import { User } from "@prisma/client";
import { getRoleLabel } from "@/domain/User/User.service";

type Props = {
  users: User[];
};

export default function UserList({ users }: Props) {
  return (
    <Table>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Pseudo</Table.Th>
          <Table.Th>Rôle</Table.Th>
          <Table.Th>E-mail</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {users.map((user) => (
          <Table.Tr key={user.id}>
            <Table.Td>{user.pseudo}</Table.Td>
            <Table.Td>{getRoleLabel(user.role)}</Table.Td>
            <Table.Td>{user.email}</Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );
}
