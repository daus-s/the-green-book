import { useEffect, useRef, useState } from "react";

export default function AdminComponent({children, title, classname}) {
    const [selected, setSelected] = useState(false);
    const ref = useRef();

    useEffect(()=>{
        function handler2(event) {
            if (ref.current && ref.current.contains(event.target)) {
                setSelected(true);
            } else {
                setSelected(false);
            }
        }

        document.addEventListener('click', handler2)
        return () => {
            document.removeEventListener('click', handler2);
        }
    },[]);

    return (
        <div className={`admin-component ${selected?'selected':''} ${classname?classname:''}`} ref={ref}>
            <div className="header-span">{title}</div>
            {children}
        </div>
    );
}