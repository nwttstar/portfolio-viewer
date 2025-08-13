import { LucideIcon } from "lucide-react";
import type { ButtonHTMLAttributes, DetailedHTMLProps } from "react";

type Props = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  Icon: LucideIcon;
};

export const IconButton = ({ Icon, className = "", ...rest }: Props) => (
  <button
    className="
      flex items-center justify-center rounded-full p-2
      hover:bg-gray-100 active:scale-95"
    {...rest}
  >
    <Icon size={20} />
  </button>
);
