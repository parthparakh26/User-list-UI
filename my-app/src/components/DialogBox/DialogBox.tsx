import React, { useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai'; 
import './DialogBox.css'; 

interface DialogProps {
  onClose: () => void;
  onDelete: () => void;
}

const DialogBox: React.FC<DialogProps> = ({ onClose, onDelete }) => {
  return (
    <div className="dialog-container">
      <div className="dialog-content">
        <div className="flex-close">
            <p className="alert-text">Are you sure you want to delete?</p>
            <button className="close-icon" onClick={onClose}><AiOutlineClose className="closeCross-button"/></button>
        </div>
        <div className="button-container">
          <button className="cancel-button" onClick={onClose}>Cancel</button>
          <button className="delete1-button" onClick={onDelete}>Delete</button>
        </div>
      </div>
    </div>
  );
};

export default DialogBox;
