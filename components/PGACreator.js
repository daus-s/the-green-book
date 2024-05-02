import { useState } from "react";
import { DateTimePicker } from '@mui/x-date-pickers';
import { urlify } from "../functions/Urlify.js";
import { supabase } from "../functions/SupabaseClient.js";
import { useModal } from "./providers/ModalContext.js";

export default function PGAPortal () {
    const [name, setName] = useState('')
    const [cut, setCut] = useState(new Date());

    const {succeed, failed} = useModal();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name) {
            alert("Please enter a valid tournament name admin.");
        }
        if (new Date() < cut) {
            const {error} = await supabase.from('tournaments').insert({
                tournament_name: name,
                cut_time: cut, //this might be a problem
                extension: urlify(name)
            });
            if (!error) {
                succeed();
                setName('');
                setCut(new Date());
            } else {
                failed();
            }
        } else {
            alert('Select a date in the future.');
        }
    }

    return (
        <div className="PGA-creator">
            <form className="new-golf-tournament form" onSubmit={handleSubmit}>
                <div className="name-entry">
                    <span>Tournament Name</span>
                    <input type="text" value={name} onChange={(e)=>setName(e.target.value)} />
                </div>
                <div className="url">
                    betties.app/pga/{urlify(name)}
                </div>
                <div className="date-time-picker">
                    <DateTimePicker label="Basic date time picker" onChange={setCut} value={cut} required/>
                </div>
                <button className="submit">Submit</button>
            </form>
        </div>
    );
}