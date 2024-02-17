import React, { useEffect } from 'react';
import Modal from 'react-modal';

//styles
import "../../styles/modals.css";

import { useModal } from '../providers/ModalContext';

const SuccessModal = ({ isOpen, onClose }) => {
  //insert timeout code here
  const { success, unsucc } = useModal();
  useEffect(()=>{
    const timeoutId = setTimeout(() => {
      unsucc();
      onClose();
    }, 3000); // WAIT 3 SECONDS

    return () => {
      clearTimeout(timeoutId);
    };
  }, [success]);

  return (
    <Modal 
      portalClassName='success-modal'
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
          width: '200px',
          height: '100px',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          padding: '10px',
          zIndex: '10000000',
        }
      }}
    >
      <div className="modal">
        <div className='success-title'>Success</div>
        <span onClick={onClose} style={{/*hover style here?*/borderRadius: '50%', position: 'absolute', top: '5px', right: '10px'}}>&times;</span>
      </div>
    </Modal>
  );
};

export default SuccessModal;
