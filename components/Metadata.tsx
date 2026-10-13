import { Stack, Text, Divider, StackProps } from "@mantine/core";
import dayjs from "@/lib/dayjs";

import useHasPermission from "@/hooks/useHasPermission";
import { Permission } from "@/domain/permissions";
import { User } from "@prisma/client";
import { usersQuery } from "@/domain/queries";
import { useQuery } from "@tanstack/react-query";

interface Props extends StackProps {
  authorId?: User["id"];
  createdAt: Date;
  updatedAt?: Date | null;
  withDivider?: boolean;
}

export default function Metadata({
  authorId,
  createdAt,
  updatedAt,
  withDivider,
  ...stackProps
}: Props) {
  const canSeeMetadata = useHasPermission(Permission.SEE_METADATA);
  const { data: users } = useQuery(usersQuery);

  const authorPseudo = users?.find((u) => u.id === authorId)?.pseudo;

  return (
    canSeeMetadata && (
      <>
        {withDivider && <Divider />}
        <Stack gap={0} {...stackProps}>
          <Text fs="italic" size="xs">
            Créé le&nbsp;
            <b>{dayjs(createdAt).format("D MMMM YYYY")}</b>
            &nbsp;à&nbsp;
            <b>{dayjs(createdAt).format("HH[h]mm")}</b>
            {authorPseudo && (
              <>
                &nbsp;par&nbsp;
                <i>
                  <b>{authorPseudo}</b>
                </i>
              </>
            )}
          </Text>
          {!!updatedAt && updatedAt !== createdAt && (
            <Text fs="italic" size="xs">
              Mis à jour le&nbsp;
              <b>{dayjs(updatedAt).format("D MMMM YYYY")}</b>
              &nbsp;à&nbsp;
              <b>{dayjs(updatedAt).format("HH[h]mm")}</b>
            </Text>
          )}
        </Stack>
      </>
    )
  );
}
