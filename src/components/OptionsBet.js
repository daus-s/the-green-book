import "../styles/bets.css";
import OptionsPlaceBetForm from "./OptionsPlaceBetForm";

const OptionsBet = ({ data: bet }) => {
  //console.log(data);
  const result = bet.open?"Open":"Closed";

  

  return (
    <div className="options bet">
      <h3
        style={{
          maxWidth: "320px",
          position: "relative",
          left: "15%",
          width: "70%",
          textAlign: "left",
        }}
      >
        {bet.title}
      </h3>
      <p>{bet.description}</p>
      {result === "Closed" ? (
        <img id="status" src="close.png" />
      ) : (
        <img id="status" src="mark.png" />
      )}
      <OptionsPlaceBetForm bet={bet} />
    </div>
  );
};

export default OptionsBet;
