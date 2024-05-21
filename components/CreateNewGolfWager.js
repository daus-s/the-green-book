import Link from "next/link";

export default function CreateNewGolfWager() {
    return (
        <Link href={window.location.href + "/place"} className="new-golf-wager" style={ngw}>
            Create New Bet
            <img src="/insert.png" style={{height: '24px', marginLeft: '10px'}}/>
        </Link>
    );
}

const ngw = {
    border: '2px solid var(--soft-highlight)',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    // width: '90%',
    color: 'var(--soft-highlight)',
    fontWeight: '600',
    justifyContent: 'space-evenly',
    margin: '10px 0px 20px 0px',
    borderRadius: '16px',
    padding: '0px 6px',
    textDecoration: 'none'
}