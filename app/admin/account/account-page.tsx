"use client";

import PasswordChangeForm, {
  ChangePasswordValues,
} from "@/components/PasswordChangeForm";
import { updatePassword } from "@/domain/User/User.webService";
import { Box, Center } from "@mantine/core";
import { useMutation } from "@tanstack/react-query";

export default function AccountPage() {
  const { isPending, mutate } = useMutation({
    mutationFn: async (values: ChangePasswordValues) =>
      await updatePassword(values),
  });

  const handleOnSubmit = (values: ChangePasswordValues) => {
    // TODO: handle submit form state (see create gig for example)
    mutate(values);
    return true;
  };
  return (
    <Center>
      <Box maw={750} miw={320}>
        <PasswordChangeForm isLoading={isPending} onSubmit={handleOnSubmit} />
      </Box>
    </Center>
  );
}
