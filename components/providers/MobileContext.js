import { useMediaQuery } from '@mui/material';
import React, { createContext, useContext, useEffect, useState } from 'react';

const MobileContext = createContext();
//
//
//
//
//
//

export const MobileProvider = ( {children} ) =>  {
    const [width, setWidth] = useState(-1);
    const [height, setHeight] = useState(-1);

    const isMobile = useMediaQuery('(max-width: 682px)');
    
    useEffect(() => {
        const handleResize = () => {
            setWidth(window.innerWidth);
            setHeight(window.innerHeight);
        };

        // Check if window is defined before accessing it
        if (typeof window !== 'undefined') {
            setWidth(window.innerWidth);
            setHeight(window.innerHeight);
            window.addEventListener('resize', handleResize);
            return () => window.removeEventListener('resize', handleResize);
        }
    }, []);

    
    return (
        <MobileContext.Provider value={{isMobile, width, height}}>
            {children}
        </MobileContext.Provider>
    );
}

export const useMobile = () => useContext(MobileContext);