import React from "react";
import { Link } from "@nextui-org/link";

const Terms = React.memo(function Terms() {
  return (
    <Link
      showAnchorIcon
      color="foreground"
      href="/legacy"
      target="_blank"
      underline="always"
    >
      les termes et conditions
    </Link>
  );
});

export { Terms };
