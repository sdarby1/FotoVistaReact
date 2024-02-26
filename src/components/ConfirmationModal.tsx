// ConfirmationModal.js

import React from 'react';

interface ConfirmationModalProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="overlay">
      <div className="confirmation-modal">
        <p>{message}</p>
        <div className="modal-buttons">
          <button onClick={onConfirm} className="confirm">Bestätigen</button>
          <button onClick={onCancel} className="decline">Abbrechen</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
