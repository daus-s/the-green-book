import React, { useState } from 'react';
import Modal from 'react-modal';

import "../../styles/modals.css";

const DeleteModal = ({ isOpen, onDelete, onCancel, betName }) => {
  const [confirmation, setConfirmation] = useState('');

  const handleDelete = () => {
    console.log('try to delete')
    if (confirmation === betName) {
      setConfirmation(''); // reset confirmation field
      onDelete();
    } else {
      alert('Confirmation text does not match bet name.');
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onRequestClose={onCancel}
      style={{
        overlay: {
          backgroundColor: 'var(--overlay)',
          zIndex: 1000 // Adjust the value based on your layout
        },
        content: {
          backgroundColor: 'var(--bet-background-color)',
          width: '768px',
          height: '400px',
          position: 'absolute',
          top: '35%',
          left: '50%',
          transform: 'translate(-50%, -50%)', 
        }
      }}
    >
      <div className="modal">
        <h2>Delete Bet</h2>
        <p style={{userSelect:"none"}}>Are you sure you want to delete the bet: {betName}?</p>
        <p>Enter the bet name <span style={{fontWeight:"bold",userSelect:"none"}}>{betName}</span> to close the bet. This will permanently close the bet and all placed bets will be refunded.</p>
        <div className="actions">
          <input
            className="delete"
            type="text"
            placeholder={`Type "${betName}" to confirm`}
            value={confirmation}
            onChange={(e) => setConfirmation(e.target.value)}
          />
          <i className="warning" style={{color:"var(--danger)"}}>This action is not reversible. Tread Carefully.</i>
          <div className="button-container">
            <button className="cancel-button" onClick={onCancel}>Cancel</button>
            <button className="confirm-delete" type="submit" ><img src="trash.png" alt="Delete" onClick={handleDelete}style={{height: "24px", width: "24px"}}/></button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteModal;
