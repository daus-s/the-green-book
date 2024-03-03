// pages/_app.js

import React from 'react';
import Providers from './_providers';

import '../styles/auth.css';
import '../styles/creategroup.css';
import '../styles/home.css';
import '../styles/menu.css';
import '../styles/profile.css';
import '../styles/social.css';
import '../styles/user.css';
import '../styles/bets.css';
import '../styles/finduserlist.css';
import '../styles/manage.css';
import '../styles/modals.css';
import '../styles/radio.css';
import '../styles/styles.css';
import '../styles/wallet.css';
import '../styles/createbet.css';
import '../styles/header.css';
import '../styles/managegroup.css';
import '../styles/passwords.css';
import '../styles/selector.css';
import '../styles/tables.css';


export default function App({ Component, pageProps }) {
  return (
    <Providers>
      <Component {...pageProps} />
    </Providers>
  );
}

