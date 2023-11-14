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
            <NumberFormatter suffix="€" decimalScale={2} value={value} />
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
