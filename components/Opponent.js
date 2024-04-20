
export default function Opponent({user, error}) {
    if (user) {
        return (
            <div className="opponent">
                <img src={user?.pfp_url} style={{borderRadius: '50%', height: '36px'}}/>
                <div className="text-fields">
                    <div className="username">
                        {user?.username}
                    </div>
                </div>
            </div>
        );
    }
    else {
        return (
            <div className={"placeholder-div"+(error?" error-wrapper opponent":"")} style={{height: '40px', width: '60%'}}>
            {error?
                <div className="error-message" style={{fontSize :'18px', color: 'var(--danger)' }}>
                    Select an opponent
                </div>
                :
                <></>
           }
            </div>
        );
    }
}