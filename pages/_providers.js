// pages/_providers.js
import React from 'react';
import { AuthProvider } from '../components/providers/AuthContext';
import { ModalProvider } from '../components/providers/ModalContext';


export default function Providers({ children }) {
  return (
    <AuthProvider>
      <ModalProvider>
        {children}
      </ModalProvider>
    </AuthProvider>
  );
}
