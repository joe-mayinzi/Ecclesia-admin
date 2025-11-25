import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export type BackDropType = "opaque" | "blur" | "transparent";

export type AlertPros = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  alertBody: React.ReactNode;
  alertTitle: string;
};

export interface CardSuggestionsUIProps {
  user: string;
  content: string;
  date: string;
  status: "lu" | "non lu";
}
