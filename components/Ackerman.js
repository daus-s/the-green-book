export default function Ackerman({ percent, pColor, oColor }) {
    const optColor = "#4caf50";
    const pesColor = "#555d50";

    const left = fullness(percent);

    // console.log("left:  { width: ", 100 * left + "%}", "\nright: { width: ", 100 * (1 - left) + "%}");

    const optimist = {
        position: "absolute",
        height: "100%",
        top: "0px",
        bottom: "0px",
        width: 100 * left + "%",
        left: "0px",
        backgroundColor: oColor ? oColor : optColor,
    };

    const pessimist = {
        top: "0px",
        bottom: "0px",
        position: "absolute",
        height: "100%",
        width: 100 * (1 - left) + "%",
        right: "0px",
        backgroundColor: pColor ? pColor : pesColor,
    };

    return (
        <div className="ackerman">
            <div className="optimist" style={optimist}></div>
            <div className="pessimist" style={pessimist}></div>
        </div>
    );
}
/* 
this could be removed idk how it will look like with more complext bets existing */
function fullness(percent) {
    return logistic(percent, 0.95);
}

function logistic(x, cap) {
    const x0 = 0.5;
    const k = 4.2;
    return cap / (1 + Math.exp(-1 * (k * (x - x0))));
}
