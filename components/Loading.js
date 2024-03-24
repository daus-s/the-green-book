// TODO: build this 
export default function Loading() {
    return (
        <div className="loading">
            <div className="first" style={{...styles.element}}>

            </div>
            <div className="second" style={{...styles.element}}>
                
            </div>
            <div className="third" style={{...styles.element}}>
                
            </div>
        </div>
    );
}

const styles = {
    element: {
        height: '10px',
        width: '10px',
        borderRadius: '5px',
        backgroundColor: 'var(--bet-background-color)',
    }
}