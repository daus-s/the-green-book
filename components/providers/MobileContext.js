import { useMediaQuery } from '@mui/material';
import React, { createContext, useContext } from 'react';

const MobileContext = createContext();

export const useMobile = () => useContext(MobileContext);

export const MobileProvider = ( {children} ) =>  {
    const isMobile = useMediaQuery('(max-width: 682px)');


    return (
        <MobileContext.Provider value={isMobile}>
            {children}
        </MobileContext.Provider>
    );
}