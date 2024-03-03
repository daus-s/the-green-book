const style = {
    borderRadius: '50%',
    backgroundColor: 'red',
    color: 'var(--bright-text)',
    position: 'absolute',
    top: '0px',
    right: '0px',
    width: '24px',
    height: '24px',
    fontSize: '18px',
    overflow: 'hidden',
    transform: 'translateX(50%) translateY(calc(-50% + 8px))',
    zIndex: '-1',
    textAlign: 'center',
    paddingTop: '2px'
}

export default function Notification({count}) {
    return (
        count
        ?
        (<div className="notification-counter" style={style}>
            {count}
        </div>)
        :
        (<></>)
    )
}