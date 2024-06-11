import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Modal } from "antd";

function ModalComponent({ isOpen, onClose, content }) {
  if (!isOpen) return null;

  return (
    <>
      <Modal
        title="Others Room Type"
        centered
        open={isOpen}
        onOk={onClose}
        onCancel={onClose}
        footer={(_, { OkBtn, CancelBtn }) => <></>}
      >
        {content}
      </Modal>
    </>
  );
}

export default ModalComponent;
