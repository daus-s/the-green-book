import "../styles/wallet.css";

export default function Wallet(props) {
  const fetchWallet = async () => {
    //await supabase
  };
  const amount = 100;
  return (
    <div className="wallet">
      <img src="money.png" alt="wallet" />
      <div>
        <div className="amount">${amount}</div>
        {/*add "add money" feature here to monetize*/}
      </div>
    </div>
  );
  //todo allow pppurchasing tokens if mponetizing also before that do full security check.
}
