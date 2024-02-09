import React from 'react';
import Modal from 'react-modal';

const SuccessModal = ({ isOpen, onClose }) => {
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
          content: {
            backgroundColor: 'var(--bet-background-color)',
            width: '400px',
            height: '200px',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)', 
          }
        }
      }}
    >
      <div className="modal">
        <h2>Success Modal</h2>
        <p>Operation was successful!</p>
        <button onClick={onClose}>Close</button>
      </div>
    </Modal>
  );
};

export default SuccessModal;
