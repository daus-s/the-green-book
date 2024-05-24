export default function Live({ position }) {
    return (
        <div className="live-icon" style={{ position: "absolute", ...{ position } }}>
            <div className="dot"></div> Live
        </div>
    );
}
