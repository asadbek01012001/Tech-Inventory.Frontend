import "./assets/app-button.scss";
import { ReactNode } from "react";

export enum BgColors {
  Green = "#16a34a",
  Red = "#dc2626",
  White = "#ffffff",
  Yellow = "#f59e0b",
  Navy = "#1e40af",
}

interface Props {
  readonly children: ReactNode;
  readonly className?: string;
  readonly icon?: ReactNode;
  readonly bgColor?: string;
  readonly hoverLabel?: string;
  readonly onClick?: () => void;
  readonly heigh?: string;
  readonly disabled?: boolean;
  readonly type?: "button" | "submit" | "reset";
  readonly loading?: boolean;
}

export default function Button({
  children,
  className,
  heigh,
  icon,
  bgColor,
  hoverLabel,
  onClick,
  disabled = false,
  type = "button",
  loading = false,
}: Props) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`app-button   ${className} ${disabled && "disabled"}`}
      style={{
        backgroundColor: bgColor,
        height: heigh,
        border: bgColor === "#ffffff" ? "1px solid #e2e8f0" : "none",
        color: bgColor === "#ffffff" ? "#1e293b" : undefined,
      }}
      onClick={onClick && onClick}
    >
      {!loading ? (
        <>
          {" "}
          {icon}
          {children}
          {Boolean(hoverLabel) && <span className="hover-label">{hoverLabel}</span>}
        </>
      ) : (
        <span>Loading...</span>
      )}
    </button>
  );
}
