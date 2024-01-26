import "../styles/bets.css";
import OptionsPlaceBetForm from "./OptionsPlaceBetForm";

const OptionsBet = ({ data }) => {
  //console.log(data);
  const result = data.open?"Open":"Closed";

  const mappedOptions = Object.entries(data.odds).map(([name, value]) => ({
    name,
    value,
  }));

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
        {data.title}
      </h3>
      <p>{data.description}</p>
      {result === "Closed" ? (
        <img id="status" src="close.png" />
      ) : (
        <img id="status" src="mark.png" />
      )}
      <OptionsPlaceBetForm options={mappedOptions} />
    </div>
  );
};

export default OptionsBet;
