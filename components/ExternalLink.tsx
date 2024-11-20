import { Anchor, AnchorProps } from "@mantine/core";
import { IconExternalLink } from "@tabler/icons-react";
import { PropsWithChildren } from "react";

// Can't find how to get basic <a> props such as "href": that's why it's added manually here
type Props = PropsWithChildren<AnchorProps> & { href: string };

export default function ExternalLink(anchorProps: Props) {
  return (
    <>
      <Anchor {...anchorProps} target="_blank" rel="noopener noreferrer">
        {anchorProps.children}
        <IconExternalLink size="0.8rem" style={{ verticalAlign: "top" }} />
      </Anchor>
    </>
  );
}
