import {
  editOrganization,
  EditOrganizationArgs,
} from "@/domain/Organization/Organization.webService";
import { notifications } from "@mantine/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useEditOrganization(afterEditCallback: () => void) {
  const queryClient = useQueryClient();

  const { isPending, mutate } = useMutation({
    mutationFn: async (formValues: EditOrganizationArgs) =>
      await editOrganization(formValues),
    onError: (error) => {
      notifications.show({
        color: "red",
        title: "Erreur à l'édition de l'association",
        message: error.message,
      });
    },
    onSuccess: () => {
      notifications.show({
        color: "green",
        message: "Association éditée avec succès !",
      });
      afterEditCallback();
      void queryClient.invalidateQueries({ queryKey: ["organizations"] });
    },
  });

  return {
    isPending,
    mutate,
  };
}
