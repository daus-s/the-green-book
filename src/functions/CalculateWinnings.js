function american(odds, wager) {
  // Check if odds and wager are valid numbers
  if (typeof odds !== "number" || typeof wager !== "number") {
    throw new Error("Both odds and wager must be numbers.");
  }
  if (odds < 0) {
    return (wager / (-1 * odds)) * 100;
  }
  if (odds > 0) {
    return (wager / 100) * (100 + odds);
  }
}

module.exports = american;
