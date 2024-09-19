// pages/_app.js
import React from "react";
import Modal from "react-modal";

import Providers from "./_providers";
import Layout from "../components/Layout";

import "../styles/auth.css";
import "../styles/creategroup.css";
import "../styles/home.css";
import "../styles/menu.css";
import "../styles/profile.css";
import "../styles/social.css";
import "../styles/user.css";
import "../styles/bets.css";
import "../styles/finduserlist.css";
import "../styles/manage.css";
import "../styles/modals.css";
import "../styles/radio.css";
import "../styles/styles.css";
import "../styles/wallet.css";
import "../styles/createbet.css";
import "../styles/header.css";
import "../styles/managegroup.css";
import "../styles/passwords.css";
import "../styles/selector.css";
import "../styles/tables.css";
import "../styles/attributions.css";
import "../styles/sidebar.css";
import "../styles/tree.css";
import "../styles/textpages.css";
import "../styles/commissioners.css";
import "../styles/icons.css";
import "../styles/admin.css";
import "../styles/commission.css";
import "../styles/dropdown.css";
import "../styles/masters.css";
import "../styles/search.css";
import "../styles/error.css";
import "../styles/mastersdash.css";
import "../styles/pgatools.css";
import "../styles/ad.css";
import "../styles/notifications.css";
import "../styles/usercomp.css";
import "../styles/input.css";
import "../styles/friends.css";
import "../styles/select.css";
import "../styles/ackerman.css";
import "../styles/bet2.css";
import "../styles/betpage.css";

Modal.setAppElement("#__next");

export default function App({ Component, pageProps }) {
    return (
        <Providers>
            <Layout>
                <Component {...pageProps} />
            </Layout>
        </Providers>
    );
}
