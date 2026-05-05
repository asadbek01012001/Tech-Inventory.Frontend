import { ReactNode } from "react";
import Modal from "react-bootstrap/Modal";
import CloseIcon from "../icons/CloseIcon";

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
    height: typeof height === "number" ? `${height}px` : (height ?? "unset"),
    overflowY: height ? "auto" : "visible",
    padding: 0,
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      backdrop="static"
      keyboard={false}
      style={modalStyle}
      dialogClassName="w-100"
      contentClassName="p-0"
    >
      <Modal.Header
        style={{
          padding: "8px 14px",
          borderBottom: "1.5px solid #dee2e6",
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          minHeight: "unset",
        }}
      >
        <button
          onClick={onHide}
          style={{
            background: "#fff",
            border: "1.5px solid #dee2e6",
            borderRadius: "8px",
            cursor: "pointer",
            padding: "4px 6px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            lineHeight: 0,
          }}
          aria-label="Close"
        >
          <CloseIcon width="18px" height="18px" />
        </button>
      </Modal.Header>
      <Modal.Body style={bodyStyle}>{children}</Modal.Body>
    </Modal>
  );
}
