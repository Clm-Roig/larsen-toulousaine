import {
  Badge,
  Group,
  NumberFormatter,
  Text,
  ThemeIcon,
  Tooltip,
} from "@mantine/core";
import { IconCurrencyEuroOff } from "@tabler/icons-react";

type Props = {
  size?: "sm" | "md";
  value: number;
};

export default function Price({ size = "md", value }: Props) {
  return (
    <>
      {!!value && (
        <Group gap={4}>
          {size === "md" && <Text size={size}>À partir de</Text>}
          <Badge size={size === "sm" ? "lg" : "xl"} color="primary" p="xs">
            <NumberFormatter
              suffix="€"
              decimalScale={2}
              /* 
              Pad with 0 only if there is somehting after the coma
                51€ ==> 51€
                22,8€ => 22,80€
              */
              fixedDecimalScale={value % 1 !== 0}
              value={value}
            />
          </Badge>
        </Group>
      )}
      {value === 0 && (
        <>
          {size === "sm" ? (
            <Tooltip label="Prix libre ou gratuit">
              <ThemeIcon radius="xl" color="secondary">
                <IconCurrencyEuroOff width={"70%"} height={"70%"} />
              </ThemeIcon>
            </Tooltip>
          ) : (
            <Badge size="lg" color="secondary" p="xs">
              Prix libre ou gratuit
            </Badge>
          )}
        </>
      )}
    </>
  );
}
