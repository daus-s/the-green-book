import React, { createContext, useContext, useState } from 'react';
import SuccessModal from '../modals/SuccessModal';
import FailureModal from '../modals/FailureModal';

const ModalContext = createContext();

export const useModal = () => useContext(ModalContext);

// the modal provider provides the failure and success modals frequently used in componentns
// each will have a function to make the modal visible
export const ModalProvider = ( {children} ) =>  {
    //provide 2 modals through this component

    //FAILURE STATES
    const [failure, setFailure] = useState(false); //visibility boolean
    const [error, setErrorMessage] = useState(null);

    //SUCCESS STATES
    const [success, setSuccess] = useState(false); //visibility boolean

    const failed = (message) => { //show failure modal
        setFailure(true);
        if (message) {
            setErrorMessage(message);
        }
    }

    const unfailed = () => { //close failure modal
        setFailure(false);
    }

    const succeed = () => { //show success modal
        setSuccess(true);
    }

    const unsucc = () => { // hide success modal
        setSuccess(false); // dont normally need to use these as they should just time out
    }

    return (
        <ModalContext.Provider value={{failure, failed, unfailed, success, succeed, unsucc}}>
            {children}
            <SuccessModal isOpen={success} onClose={unsucc}/>
            <FailureModal isOpen={failure} onClose={unfailed} error={error}/>
        </ModalContext.Provider>
    );
}