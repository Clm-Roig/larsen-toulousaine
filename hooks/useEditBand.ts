import { editBand, EditBandArgs } from "@/domain/Band/Band.webService";
import { notifications } from "@mantine/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useEditBand(afterEditCallback: () => void) {
  const queryClient = useQueryClient();

  const { isPending, mutate } = useMutation({
    mutationFn: async (formValues: EditBandArgs) => await editBand(formValues),
    onError: (error) => {
      notifications.show({
        color: "red",
        title: "Erreur à l'édition du groupe",
        message: error.message,
      });
    },
    onSuccess: () => {
      notifications.show({
        color: "green",
        message: "Groupe édité avec succès !",
      });
      afterEditCallback();
      void queryClient.invalidateQueries({ queryKey: ["bands"] });
    },
  });

  return {
    isPending,
    mutate,
  };
}
