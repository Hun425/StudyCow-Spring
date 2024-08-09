import React, { useState } from "react";
import ReactModal from "react-modal";
import StudyEnter from "./StudyEnter";
import "./styles/StudyEnterModal.css";

const StudyEnterModal = ({ isOpen, onRequestClose, roomId }) => {
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="Modal"
      overlayClassName="Overlay"
      ariaHideApp={false}
    >
      <StudyEnter roomId={roomId} onRequestClose={onRequestClose} />
    </ReactModal>
  );
};

export default StudyEnterModal;
