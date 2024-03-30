// TODO: build this 
export default function Loading({style}) {
    return (
        <div className="loading" style={{...styles.loading, ...style}}>
            <div className="first loader" style={{...styles.element, ...styles.first}}>

            </div>
            <div className="second loader" style={{...styles.element, ...styles.second}}>
                
            </div>
            <div className="third loader" style={{...styles.element, ...styles.third}}>
                
            </div>
        </div>
    );
}

const styles = {
    element: {
        height: '10px',
        width: '10px',
        borderTopLeftRadius: '5px',
        borderTopRightRadius: '5px',
        borderBottomLeftRadius: '5px',
        borderBottomRightRadius: '5px',
        backgroundColor: 'var(--bet-background-color)',
        animation: 'loadingAnimation 2.125s infinite ease-in-out',
        position: 'relative',
        bottom: '0px',
        transformOrigin: 'center bottom'
    },
    loading : {
        height: '43px',
        width: '40px',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        margin: '20px',
        alignItems: 'flex-end',
    }, 
    first : {
        animationDelay: '0s'
    },
    second : {
        animationDelay: '.53125s'
    }, 
    third : {
        animationDelay: '1.0625s'
    }
}