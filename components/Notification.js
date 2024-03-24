const prestyle = {
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
    zIndex: '2',
    textAlign: 'center',
    paddingTop: '2px'
}
/**
 * Example:
 * <div className="requests-container-title notification-box">
 *     Join Requests
 *     <Notification count={count}/>
 * </div>
 * 
 */
export default function Notification({count, style}) {
    return (
        count
        ?
        (<div className="notification-counter" style={{...prestyle, ...style}}>
            {count}
        </div>)
        :
        (<></>)
    )
}