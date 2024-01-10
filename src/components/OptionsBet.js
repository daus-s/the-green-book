import "../styles/bets.css";
import OptionsPlaceBetForm from "./OptionsPlaceBetForm";

const OptionsBet = ({ data }) => {
  console.log(data);
  const result = data.result?"Open":"Closed";
  const placeholder /**sample data */ = {
    title: "Most Likely to Become Force Sensitive in 2024",
    description:
      "Explore the mysteries of the cosmos! In the year 2024, gaze into the stars and make predictions about individuals who may unlock the secrets of the Force. Place your bets on who is most likely to become Force sensitive, and let the cosmic energies guide your choices!",
  };
  const options = {
    Chad: 600,
    Daus: -250,
    Grogu: 250,
  };

  const mappedOptions = Object.entries(options).map(([name, value]) => ({
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
