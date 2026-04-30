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
  const rawWidth = typeof width === "number" ? `${width}px` : width;

  const modalStyle = rawWidth
    ? ({ "--bs-modal-width": rawWidth } as React.CSSProperties)
    : undefined;

  const bodyStyle: React.CSSProperties = {
    maxHeight: typeof height === "number" ? `${height}px` : (height ?? "unset"),
    overflowY: height ? "auto" : "visible",
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      style={modalStyle}
      contentClassName="p-0"
    >
      <Modal.Body style={bodyStyle}>{children}</Modal.Body>
    </Modal>
  );
}
