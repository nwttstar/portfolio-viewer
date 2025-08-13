import type { ButtonHTMLAttributes, DetailedHTMLProps } from "react";

type ButtonVariant = "primary" | "ghost";

type Props = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  variant?: ButtonVariant;
};

export const Button = ({ variant = "primary", ...rest }: Props) => {
  const style = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    ghost: "bg-transparent text-gray-800 hover:bg-gray-100",
  };

  return (
    <button
      className={`
        rounded-lg px-4 py-2 font-medium transition
        active:scale-95 focus:outline-none
        ${style[variant]}
      `}
      {...rest}
    />
  );
};
