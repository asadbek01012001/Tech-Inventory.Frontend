import { ReactNode } from "react";
import Modal from "react-bootstrap/Modal";

interface Props {
  readonly show: boolean;
  readonly onHide: () => void;
  readonly children: ReactNode;
  readonly width?: string | number;
  readonly height?: string | number;
}

export default function CustomModal({ show, onHide, children, width, height }: Props) {
  const dialogStyle: React.CSSProperties = {
    width: typeof width === "number" ? `${width}px` : width,
    maxWidth: "100%",
  };

  const bodyStyle: React.CSSProperties = {
    maxHeight: typeof height === "number" ? `${height}px` : (height ?? "unset"),
    overflowY: height ? "auto" : "visible",
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      dialogStyle={dialogStyle}
      size="xl"
      contentClassName="p-0"
    >
      <Modal.Body style={bodyStyle}>{children}</Modal.Body>
    </Modal>
  );
}
