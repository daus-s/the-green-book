import { useEffect, useState } from "react";
import { supabase } from "../functions/SupabaseClient";
import { useAuth } from "./providers/AuthContext";
import { useModal } from "./providers/ModalContext";

function PictureSelector({src, selected, setSelected}) {
    let a = selected === src;
    const fileNameWithoutExtension = src.substring(
        src.lastIndexOf('/') + 1, // Find the last slash in the path
        src.lastIndexOf('.')      // Find the last dot in the file name
      );
    const checked = {
        border: "2px dashed var(--text-color)", //border 2px thick, dashed, borderRadius 8px slight curve
        borderRadius: "8px",
        backgroundColor: "var(--highlighted-dark)",
    };

      return (
        <div className="picture-selector grid-item" style={a?checked:null} onClick={() => setSelected(src)}>
            <img src={src} alt={fileNameWithoutExtension} />
            <label className="selector-radio">
                <input
                type="radio"
                checked={selected === src}
                value={src}
                readOnly
                />
            <span></span>
          </label>
        </div>
      );
}

export default function ProfileSelection({close}) {
    const [selected, setSelected] = useState();
    const urls = ["frog.jpg","grasshopper.jpg","ladybug.jpg","lion.jpg","penguin.jpg","redpanda.jpg"];
    const prefix = "users/"; //use this so it ca be migrated to storage if need be

    const { user, meta } = useAuth();
    const { failed, succeed } = useModal();

    useEffect(()=>{
        setSelected(meta.pfp)
    },[]);

    const updateURL = async () => {
        const { error } = await supabase.from('public_users').update({pfp_url:selected}).eq("email", user.email);
        if (error) {
            failed(error);
          }
          else if (!error) {
            succeed();
            close(false);
            window.location.reload();
          }
    };

    return (
        <div className="profile-selection grid-container">
            {urls.map((item, index)=>(
                <PictureSelector src={prefix+item} selected={selected} setSelected={setSelected}/>
            ))}
            <div className="full-width-element">
                <button className="confirm-button" onClick={updateURL}>Confirm</button>
            </div>
        </div>
    );
}