import React from 'react';
import Modal from 'react-modal';

//styles
import "../../styles/modals.css";

const RequestModal = ({ isOpen, onClose, group, onConfirm}) => {
  return (
    <Modal 
      isOpen={isOpen} 
      onRequestClose={onClose}
      style={{
        overlay: {
          backgroundColor: 'var(--overlay)',
          zIndex: 1000 // Adjust the value based on your layout
        },
        content: {        
          backgroundColor: 'var(--bet-background-color)',
          borderColor: 'var(--bet-option-highlight)',
          width: '600px',
          height: '300px',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          padding: '20px 10px 10px 20px',
          zIndex: '10000000',
        }
      }}
    >
      <div className="modal">
        <div className='modal-title'>Request to join</div>
        <div className='request-text'>Do you want to join <b>{group?group:"this group"}</b>?</div>
        <div className="button-container">
          <button  className="cancel-button" onClick={onClose}>Cancel</button>
          <button className="confirm-button skinny" onClick={onConfirm}>Join</button>
        </div>
      </div>
    </Modal>
  );
};

export default RequestModal;