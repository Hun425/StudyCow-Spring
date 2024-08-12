import React, { useState } from "react";
import ReactModal from "react-modal";
import StudyEnter from "./StudyEnter";
import "./styles/StudyEnterModal.css";

const StudyEnterModal = ({ isOpen, onRequestClose, roomId }) => {
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="enterModal"
      overlayClassName="enterOverlay"
      ariaHideApp={false}
      shouldCloseOnOverlayClick={true}
    >
      <StudyEnter roomId={roomId} onRequestClose={onRequestClose} />
    </ReactModal>
  );
};

export default StudyEnterModal;
