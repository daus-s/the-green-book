import React, { useEffect } from 'react';
import Modal from 'react-modal';

const MastersInfoModal = ({ isOpen, onClose }) => {
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
          width: '600px',
          height: '340px',
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
        <div className='success-title'>PGA Tour Masters Fantasy Info</div>
        <div className='instructions'>
        Betting on Golf tournaments 
        (usually just the majors)

        After the cut round (2nd), bettors build a team of 4 golfers.  Similar to drafts in Fantasy football, with alternating picks, each bettor selects a golfer to add to their team. 

        After the final round, the winner payouts are determined by the following:

        $1.00 for golf tournament winner on your team
        $0.50 for tournament second place
        $0.25 per stroke.  
        Each player’s score is added to the better’s team total.  The bettor’s team with the lowest score gets $0.25 per stroke.

        Source for live statistics  
        https://www.pgatour.com/tournaments/2023/masters-tournament/R2023014

        </div>
        <span onClick={onClose} style={{/*hover style here?*/borderRadius: '50%', position: 'absolute', top: '5px', right: '10px'}}>&times;</span>
      </div>
    </Modal>
  );
};

export default MastersInfoModal;