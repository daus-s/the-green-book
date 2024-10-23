import QRCode from "react-qr-code";

export default function QR({ href }) {
    return (
        <div style={{ background: "white", padding: "16px" }}>
            <QRCode size={256} style={{ height: "auto", maxWidth: "100%", width: "100%" }} value={href} viewBox={`0 0 256 256`} />
        </div>
    );
}
