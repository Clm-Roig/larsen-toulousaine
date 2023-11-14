import { Badge, NumberFormatter, Text } from "@mantine/core";

type Props = {
  size?: "sm" | "md";
  value: number;
};

export default function Price({ size = "md", value }: Props) {
  return (
    <>
      {!!value && (
        <Text size={size}>
          À partir de{" "}
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
        </Text>
      )}
      {value === 0 && (
        <Badge size="lg" color="primary" p="xs">
          Prix libre ou gratuit
        </Badge>
      )}
    </>
  );
}
