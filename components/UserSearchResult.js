import { useMobile } from "./providers/MobileContext";

export default function UserSearchResult ({r, select, style})  {
    const {isMobile} = useMobile();
    return (
        <div className='result' onClick={()=>select(r)} style={isMobile?{...style, ...mobileStyle.result}:{...style}}>
            <div className='result-pfp'>
                <img src={r.pfp_url} style={{height: isMobile?'55px':'60px', borderRadius:'50%'}}/>
            </div>
            <div className='text-fields'>            
                <div className='username'>{r.username}</div>
                <div className='email'>{r.email}</div>
            </div>
        </div>
    )
}

const mobileStyle = {    
    result: { 
        width: 'calc(100% - 20px)',
    },
}