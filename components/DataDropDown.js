import { useState, useEffect, useRef } from "react";

function DropDownItem({data, index, onClick}) {
    return (
        <div className="data-drop-down-item" onClick={onClick}>
            {JSON.stringify(data)}
        </div>
    )
} 

export default function DataDropDown({ list, JSX, setIndex }) {
    const [visible, setVisible] = useState(false);
    const [display, setDisplay] = useState({});
    const ref = useRef();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                console.log('fuck u pt. 2')
                if (visible) {
                    setVisible(false);
                }
            }
        };
        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    if (JSX) {
        return (
            <div className="drop-down-selector" onClick={()=>setVisible(prev=>!prev)} ref={ref}>
                {
                visible?
                    list.map((item, index)=>(
                        <JSX key={item.index?item.index:index} data={item} onClick={()=>setDisplay(item)}/>
                    ))
                :
                    <JSX key={display.index?display.index:-1} data={display}/>}
            </div>
        );
    } 
    return (
        <div className="drop-down-selector" ref={ref}>
            {
            visible?
                list.map((item, index)=>(
                    <DropDownItem key={item.index?item.index:index} data={item} onClick={()=>{
                        console.log('fuck you')
                        setDisplay(item); 
                        typeof setIndex == 'function' ? setIndex(item.index?item.index:index) : ()=>{};
                        setVisible(false);
                    }}/>
                ))
            :
                <DropDownItem 
                            key={display.index?display.index:-1} 
                            data={display} 
                            onClick={()=>{
                                setVisible(true);
                                console.log('get big');
                            }}/>}
        </div>
    );
    
}