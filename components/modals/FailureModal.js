import React, { useEffect } from 'react';
import Modal from 'react-modal';


import { useModal } from '../providers/ModalContext';

//69420 is reserved
const codes = {
  '23505': 'User is already a member of group',
}

const FailureModal = ({ isOpen, onClose, error }) => {
  const { code, message } = error?error:{code: 69420, message:'Something unexpected occured. :('}; //destructure argument
  const { failure, unfailed } = useModal();

  useEffect(()=>{
    const timeoutId = setTimeout(() => {
      unfailed();
      onClose();
    }, 3000); // WAIT 3 SECONDS

    return () => {
      clearTimeout(timeoutId);
    };
  }, [failure]);

  /*  this has a portalClassName because it goes over the Request Modal by setting the z-index of this class over the creating modal
      could change to creating the new modal in a modal 
        returning
        condition ?  
          <SuccessModal some={bullshit}/>
        :
        <none>
   */
  return (
    <Modal 
      portalClassName='failure-modal'
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
          minWidth: '400px',
          minHeight: '200px',
          width: '400px',
          height: '200px',
          aspectRatio: '2',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          padding: '10px',
          zIndex: 10000000,
        }, 
     }}
    >
      <div className="modal" style={{justifyContent: 'flex-start'}}>
        <h2>Failure</h2>
        <i style={{paddingTop: '20px'}}>{code&&codes[code]?codes[code]:'Something unexpected occured.'}</i> {/* banger line of code tbh */}
        <span onClick={onClose} style={{/*hover style here?*/borderRadius: '50%', position: 'absolute', top: '5px', right: '10px'}}>&times;</span> 
        {code&&codes[code]?"":
        <div className='report'>
          <a href='https://github.com/daus-s/the-green-book/issues'>Report</a>
        </div>
        }
      </div>
    </Modal>
  );
};

export default FailureModal;


//todo: add a link to report unexpected errorsthat dont have a code established by sending to gthub issues page