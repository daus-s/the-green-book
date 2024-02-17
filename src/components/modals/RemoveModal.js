import React from 'react';
import Modal from 'react-modal';

import "../../styles/modals.css";

const RemoveModal = ({ isOpen, onCancel, onConfirm, username  }) => {
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
          height: '200px',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          
        }
      }}
    >
      <div className="modal remove-user">
        <h2>Remove User</h2>
        <p>Are you sure you want to remove <span style={{fontWeight:"700"}}>{username}</span> from the group?</p>
        <div className='button-container'>
            <button className='cancel-button' onClick={onCancel}>Cancel</button>
            <button className='confirm-remove' onClick={onConfirm}>Confirm</button>
        </div>
      </div>
    </Modal>
  );
};

export default RemoveModal;