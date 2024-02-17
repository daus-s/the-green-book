import React from 'react';
import Modal from 'react-modal';

import "../../styles/modals.css";

const ConfirmModal = ({ isOpen, onCancel, onConfirm, title, option }) => {
  //think nyx from wish.com
  return (
    <Modal 
      isOpen={isOpen} 
      onRequestClose={onCancel}
      style={{
        overlay: {
          backgroundColor: 'var(--overlay)',
          zIndex: 1000, // Adjust the value based on your layout
        },
        content: {
          backgroundColor: 'var(--bet-background-color)',
          width: '768px',
          height: '400px',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          
        }
      }}
    >
      <div className="modal">
        <div className='modal-title-container'>
          <div className='modal-title'>{title}</div>
          <div className='modal-title descriptor'>Cash Out</div>
        </div>
        <div className="modal-data">
          <div className='confirm-modal-bet'>{option.name}</div>
          <p className="modal-data">Winning Bet</p>
          <div className='confirm-modal-value'>{option.value}</div>
        </div>
        <div className="button-container">
          <button  className="cancel-button" onClick={onCancel}>Cancel</button>
          <button className="confirm-button" onClick={onConfirm}>Confirm</button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
