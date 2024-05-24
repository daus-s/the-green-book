import React, { useState } from 'react';
import Modal from 'react-modal';
import { useMobile } from '../providers/MobileContext';



const DeleteModal = ({ isOpen, onDelete, onCancel, betName }) => {
  const [confirmation, setConfirmation] = useState('');
  const { isMobile } = useMobile();

  const handleDelete = () => {
    if (confirmation === betName) {
      setConfirmation(''); // reset confirmation field
      onDelete();
    } else {
      alert('Confirmation text does not match bet name.');
    }
  };

  const cancelWrapper = () =>{
    setConfirmation(''); //make sure to garbage collect
    onCancel();
  }

  return (
    <Modal 
      isOpen={isOpen} 
      onRequestClose={cancelWrapper}
      style={{
        overlay: {
          backgroundColor: 'var(--overlay)',
          zIndex: 1000 // Adjust the value based on your layout
        },
        content: {
          backgroundColor: 'var(--bet-background-color)',
          width: isMobile?'calc(100% - 20px)':'768px',
          height: isMobile?'fit-content':'400px',
          position: 'absolute',
          top: '35%',
          left: '50%',
          transform: isMobile?'translate(-50%, calc(-50% + 50px))':'translate(-50%, -50%)',  //blame if weird on diffferent devices
        }
      }}
    >
      <div className="modal" style={isMobile?{height: 'auto'}:{}}>
        <h2>Delete Bet</h2>
        <p style={{userSelect:"none"}}>Are you sure you want to delete the bet: {betName}?</p>
        <p>Enter the bet name <span style={{fontWeight:"bold",userSelect:"none"}}>{betName}</span> to close the bet. This will permanently close the bet and all placed bets will be refunded.</p>
        <div className="actions" style={isMobile?{maxWidth: 'calc(100% - 20px)'}:{}}>
          <input
            className="delete"
            type="text"
            placeholder={`Type "${betName}" to confirm`}
            value={confirmation}
            onChange={(e) => setConfirmation(e.target.value)}
            style={isMobile?{maxWidth: '100%', overflowX: 'auto', overflowY: 'hidden', }:{}}
          />
          <i className="warning" style={{color:"var(--danger)"}}>This action is not reversible.<br/>Tread Carefully...</i>
          <div className="button-container">
            <button className="cancel-button" onClick={cancelWrapper}>Cancel</button>
            <button className="confirm-delete" type="submit" ><img src="/trash.png" alt="Delete" onClick={handleDelete}style={{height: "24px", width: "24px"}}/></button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteModal;
