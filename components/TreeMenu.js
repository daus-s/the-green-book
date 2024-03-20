import { useEffect, useState } from "react";
import { useAuth } from "./providers/AuthContext";
import { useMobile } from "./providers/MobileContext";
import { antiRotation, carteFromAngle } from "../functions/pythagoras"; 
import Link from "next/link";

function Tree() {
    return (
        <div className="tree">
            <img src="the-book.jpg"></img>
        </div>
    );
}

function Leaf({fraction, content}) {
    const { isMobile } = useMobile();
    const [rotation, setRotation] = useState(0);
    const [display, setDisplay] = useState(false);


    if (!fraction||!fraction.num&&typeof fraction.num !== 'number'||!fraction.den&&typeof fraction.den !== 'number') { //type checking
        throw new Error('fraction must be a JSON with 2 properties {num: number, den: number}');
    }
    const { num, den } = fraction

    if (!content||!content.icon||!content.title||!content.desc||!content.link) {
        throw new Error('content must include an icon, title and description field\ncontent:{\n\ticon: string,\n\ttitle: string,\n\tdescription: string}');
    }
    const { icon, title, desc, link } = content


    useEffect(()=>{
        const rotate = () => {
            let deg = 360 * num/den;
            setRotation(deg);
        }
        rotate();
    },[])
    //on load rotate leaf box i/n * 360 degrees
    //rotate leaf inversesly -i/n * 360 degrees
    const transformation = `rotate(${antiRotation(360*num/den)})\
                            translateX(${carteFromAngle(fraction, 90).x}%) translateX(${carteFromAngle(fraction, 80).x}px)
                            translateY(${-1*carteFromAngle(fraction, 90).y}%) translateY(${-1*carteFromAngle(fraction, 80).y}px)`;
                            console.log(transformation)
    return (
        <div className="leaf-box" style={{transform: `rotate(${rotation}deg)`}} >
            <Link href={link} className="leaf" style={{transform: `rotate(-${rotation}deg)`}} onMouseEnter={()=>{setDisplay(true)}} onMouseLeave={()=>{setDisplay(false)}}>
                <img className='rotate-img' src={icon} style={{width: isMobile?'32px':'56px'}}/>
                {title}
            </Link>
            {display&&                                                                             // x then y then z
            <div className="dendrology" style={{margin: '40px', transform: transformation}}>
                {desc}
            </div>
            }
        </div>
    );
}//, padding: 0


export default function TreeMenu() {
    const { user, meta } = useAuth();
    const { isMobile, height, width} = useMobile();
    const elementWidth = `${Math.min(height, width) - 104}px`;

    const leaves = [
        {icon:'bet.png', title: 'Bet', desc: (<div className="dendi-header">Wager on bets with your friends</div>), link: '/bets', comsec: false},
        {icon:'balance.png', title: 'Wallet', desc: 'Manage your funds, view your transaction history, and top up your balance.', link: '/wallet', comsec: false}, 
        {icon:'history.png', title: 'History', desc: 'View your betting history, including past bets, outcomes, and earnings.', link: '/history', comsec: false}, 
        {icon:'social.png', title: 'Groups', desc: 'Join or create groups to bet with friends and compete against other groups.', link: '/social', comsec: false}, 
        {icon:'groupsettings.png', title: 'Group Manager', desc: 'Manage your betting group, including member invitations, group settings, and group activities.', link: '/your-groups', comsec: true}, 
        {icon:'creategroup.png', title: 'New Group', desc: 'Create a new betting group, set group rules, and invite members to join.', link: '/new-group', comsec: true}, 
        {icon:'bookkeeping.png', title: 'Bookkeeper', desc: 'Keep track of group finances, manage bets, and handle group payouts.', link: '/bookkeeping', comsec: true},
        {icon:'newbet.png', title: 'New Bet', desc: 'Create a new bet with custom parameters, such as bet type, stake amount, and bet deadline.', link: '/new-bet', comsec: true},
      ];
      
    //defione tranistion expand in spiral
    const prune = (leaves, c) => {
        console.log(leaves, c);
        if (leaves&&!leaves.filter) {
            throw new Error('leaves must be an Array.')
        }
        if (!c) {
            return leaves.filter((word)=>!word['comsec']);
        }
        return leaves;
    }
    let pruned = prune(leaves, meta.commish)
    return (
        <div className="tree-menu" style={isMobile?{width: elementWidth}:{}}>
                <Tree />
                {pruned.map((content, index)=><Leaf content={content} key={index} fraction={{num: index, den: pruned.length}}/>)}
            {(user&&meta)?<></>:<button onClick={()=>window.location.href = "/login"}>Log in</button>}        
        </div>
    );
}