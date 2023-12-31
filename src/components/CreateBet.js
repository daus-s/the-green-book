export default function CreateBet(props) {
  const [type, setType] = useState("overUnder");
  return (
    <div>
      <form>
        <label name="title">Title:</label>
        <input type="text" name="title" />
        <label name="description">Description:</label>
        <input type="textarea" name="description" />
        <input type="radio">Over-Under</input>
        <input type="radio">Moneyline</input>
        <input type="radio">Options</input>
        {type == "overUnder" ? (
          "overunder bet form"
        ) : type == "moneyline" ? (
          "moneyline bet form"
        ) : type == "options" ? (
          "options bet form"
        ) : (
          <None></None>
        )}
        <button>Submit</button>
      </form>
    </div>
  );
}
