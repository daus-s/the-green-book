import { useState } from "react";
import { DateTimePicker } from '@mui/x-date-pickers';;



export default function PGAPortal () {
    const [name, setName] = useState('')
    const [cut, setCut] = useState(new Date())
    return (
        <div className="PGA-creator">
            <form className="new-golf-tournament form">
                <span>Name</span><input type="text" value={name} onChange={(e)=>setName(e.target.value)} />
                <DateTimePicker label="Basic date time picker" className="deez" onChange={setCut} value={cut} required/>
            </form>
        </div>
    );
}