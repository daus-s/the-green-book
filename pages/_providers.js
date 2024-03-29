// pages/_providers.js
import React from 'react';
import { AuthProvider } from '../components/providers/AuthContext';
import { ModalProvider } from '../components/providers/ModalContext';
import { MobileProvider } from '../components/providers/MobileContext';


export default function Providers({ children }) {
  return (
    <MobileProvider>
      <AuthProvider>
        <ModalProvider>
            {children}
        </ModalProvider>
      </AuthProvider>
    </MobileProvider>

  );
}
