// pages/_providers.js
import React from "react";
import { AuthProvider } from "../components/providers/AuthContext";
import { ModalProvider } from "../components/providers/ModalContext";
import { MobileProvider } from "../components/providers/MobileContext";

//open source?
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { TournamentProvider } from "../components/providers/TournamentContext";
import { PlayerProvider } from "../components/providers/PlayerContext";

export default function Providers({ children }) {
    /* nah if aliens had space travel a.k.a. sublight or like close fsfs
     * theyre not gonna build some lame shit like the pyramids
     * theyll build like inverted pyramids to flex on humans
     *
     * OR this:
     * https://open.spotify.com/track/7eNPLy3AXyy0IEAFIrTiyR?si=fa334f5a6cc74ab1
     *
     * DIAGRAM
     *   .____
     *  / \  /
     * /___\/    -human version (mid)
     * _____
     * \   /
     *  \ /
     *   V
     *  / \
     * /   \     floating in the air??? insane (W)
     */
    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <MobileProvider>
                <AuthProvider>
                    <ModalProvider>
                        <TournamentProvider>
                            <PlayerProvider>{children}</PlayerProvider>
                        </TournamentProvider>
                    </ModalProvider>
                </AuthProvider>
            </MobileProvider>
        </LocalizationProvider>
    );
}
