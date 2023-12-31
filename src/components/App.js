import "../styles/styles.css";
import OverUnderBet from "./OverUnderBet";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "./Header";
import Auth from "./Auth";
import NewUser from "./NewUser";
import Wallet from "./Wallet";
import CreateGroup from "./CreateGroup";
import MoneyLineBet from "./MoneylineBet";
import OptionsBet from "./OptionsBet";

export default function App() {
  const isMobile = useMediaQuery("(max-width:600px)");
  return (
    <div className="App">
      <Header />
      {/* <OverUnderBet id="0xae452e7c890" />
      <NewUser />
      <Auth />
      <Wallet /> 
      <CreateGroup />
      */}
      <OverUnderBet />
      <MoneyLineBet />
      <OptionsBet />
    </div>
  );
}
