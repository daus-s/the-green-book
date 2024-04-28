import { useState } from "react";
import { DateTimePicker } from '@mui/x-date-pickers';import { urlify } from "../functions/Urlify";
;



export default function PGAPortal () {
    const [name, setName] = useState('')
    const [cut, setCut] = useState(new Date())
    return (
        <div className="PGA-creator">
            <form className="new-golf-tournament form">
                <div className="name-entry">
                    <span>Name</span><input type="text" value={name} onChange={(e)=>setName(e.target.value)} />
                </div>
                <div className="url">
                    betties.app/pga/{urlify(name)}
                </div>
                <div className="date-time-picker">
                    <DateTimePicker label="Basic date time picker" onChange={setCut} value={cut} required/>
                </div>
            </form>
        </div>
    );
}