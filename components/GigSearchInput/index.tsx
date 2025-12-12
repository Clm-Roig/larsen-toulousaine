import {
  Combobox,
  Loader,
  Overlay,
  ScrollArea,
  TextInput,
  useCombobox,
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { searchGigs } from "@/domain/Gig/Gig.webService";
import { GigWithBandsAndPlace } from "@/domain/Gig/Gig.type";
import { useDebouncedState } from "@mantine/hooks";
import { useRouter } from "next/navigation";
import Option from "./Option";
import { IconSearch } from "@tabler/icons-react";

const NB_CHAR_TO_LAUNCH_GIG_SEARCH = 2;

export default function GigSearchInput() {
  const router = useRouter();
  const combobox = useCombobox({
    onDropdownClose: () => {
      combobox.resetSelectedOption();
    },
  });
  const [inputValue, setInputValue] = useDebouncedState("", 200);

  const { data: gigs, isLoading } = useQuery<GigWithBandsAndPlace[] | null>({
    queryKey: ["searchedGigs", inputValue],
    queryFn: async () => {
      if (!inputValue || inputValue.length < NB_CHAR_TO_LAUNCH_GIG_SEARCH) {
        return null;
      }
      return await searchGigs(inputValue);
    },
  });

  const options = (gigs ?? []).map((gig) => <Option key={gig.id} gig={gig} />);

  return (
    <>
      <Combobox
        onOptionSubmit={(optionValue) => {
          combobox.closeDropdown();
          router.push(`/${optionValue}`);
        }}
        store={combobox}
      >
        <Combobox.Target>
          <TextInput
            placeholder="Chercher un groupe ou une salle"
            defaultValue={inputValue}
            onChange={(event) => {
              setInputValue(event.currentTarget.value);
              combobox.resetSelectedOption();
              combobox.openDropdown();
            }}
            onClick={() => {
              combobox.openDropdown();
            }}
            onFocus={() => {
              combobox.openDropdown();
            }}
            onBlur={() => {
              combobox.closeDropdown();
            }}
            rightSection={isLoading && <Loader size={14} />}
            leftSection={<IconSearch />}
            maw={500}
            style={{ flex: 1, zIndex: 201 }} // to put it above black overlay
          />
        </Combobox.Target>

        <Combobox.Dropdown
          hidden={
            !inputValue ||
            inputValue.length < NB_CHAR_TO_LAUNCH_GIG_SEARCH ||
            isLoading
          }
        >
          <Combobox.Options>
            <ScrollArea.Autosize mah={"80vh"} type="scroll">
              {options}
              {options.length === 0 && (
                <Combobox.Empty>Aucun concert trouvé</Combobox.Empty>
              )}
            </ScrollArea.Autosize>
          </Combobox.Options>
        </Combobox.Dropdown>
      </Combobox>
      {combobox.dropdownOpened && <Overlay fixed blur={1} zIndex={200} />}
    </>
  );
}
