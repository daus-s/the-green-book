const preStyle = {
    width: '24px',
    height: '24px',
    position: 'absolute',
    right: '0px',
    bottom: '0px',
    transform: 'translateX(12%) translateY(-27%)',
    margin: '0px !important',
}

export default function CommissionerShield({ style }) {
    if (style && style.height && !style.width) {
        style.width = style.height;
    }
    if (style && style.width && !style.height) {
        style.height = style.width;
    }
    return (
        <img src="/shield.png" style={{ ...preStyle, ...style }}/>
    );
}