import { useEffect, useState } from "react";
import { useAuth } from "./providers/AuthContext";
import { useMobile } from "./providers/MobileContext";
import Link from "next/link";

/* DONT TRY ANY FANCY SHIT
   THIS WILL BREAK THE ANIMATION
   essentially what happens is that no matter the order of execution meta is defined last and so the first tree rendered is the user tree 
   this means all the leaves are in their user tree position
   to avoid this we have to just 

   --Potential fix?
   prune tree in the useEffect on load and on meta ie
    const [tree, setTree] = useState([]);
    useEffect(()=>{
      //do shit
      const prune() => {
        setTree(...)
        //render on the new tree object
      }
      
      call();
    }, [meta]);

    Sample code?

    const prune = (leaves) => {
        if (meta.constructor === Object && Object.keys(meta).length >= 0) {
            if (leaves&&!leaves.filter) {
                throw new Error('leaves must be an Array.')
            }
            return leaves.filter((word)=>!word['comsec']);
        }
    }
*/
function LoginTree() {
    const { isMobile, height, width} = useMobile();
    const landscape = height < width;
    const elementWidth = landscape ? `${Math.min(height, width) - 196}px` :  `${Math.min(height, width) - 104}px`;

    return (
        <div className="tree-menu" style={isMobile?{width: elementWidth, margin: landscape ? '22px' : '92px 52px 52px 52px'}:{}}>
            <Tree />
            {<Link className="login" href="/login">Log in</Link>}        
        </div>
    );
}

function UserTree() {
    const { isMobile, height, width} = useMobile();
    const landscape = height < width;
    const elementWidth = landscape ? `${Math.min(height, width) - 196}px` :  `${Math.min(height, width) - 104}px`;

    const leaves = [
        {icon:'bet.png', title: 'Bet',  link: '/bets', },
        {icon:'balance.png', title: 'Wallet',  link: '/wallet', }, 
        {icon:'history.png', title: 'History',  link: '/history', }, 
        {icon:'social.png', title: 'Groups', link: '/social', }, 

      ];

    return (
        <div className="tree-menu unloaded" style={isMobile?{width: elementWidth, margin: landscape ? '22px' : '92px 52px 52px 52px'}:{}}>
            <Tree />
            {leaves.map((content, index)=><Leaf content={content} key={index} fraction={{num: index, den: leaves.length}}/>)}
        </div>
    );
}

function CommissionerTree() {
    const { isMobile, height, width} = useMobile();
    const landscape = height < width;
    const elementWidth = landscape ? `${Math.min(height, width) - 196}px` :  `${Math.min(height, width) - 104}px`;

    const leaves = [
        {icon:'bet.png', title: 'Bet',  link: '/bets', },
        {icon:'balance.png', title: 'Wallet',  link: '/wallet', }, 
        {icon:'history.png', title: 'History',  link: '/history', }, 
        {icon:'social.png', title: 'Groups', link: '/social', }, 
        {icon:'groupsettings.png', title: 'Group Manager', link: '/your-groups', }, 
        {icon:'creategroup.png', title: 'New Group', link: '/new-group', }, 
        {icon:'bookkeeping.png', title: 'Bookkeeper',  link: '/bookkeeping', },
        {icon:'newbet.png', title: 'New Bet', link: '/new-bet', },
      ];

    return (
        <div className="tree-menu unloaded" style={isMobile?{width: elementWidth, margin: landscape ? '22px' : '92px 52px 52px 52px'}:{}}>
            <Tree />
            {leaves.map((content, index)=><Leaf content={content} key={index} fraction={{num: index, den: leaves.length}}/>)}
        </div>
    );
}

function UnloadedTree() {
    const { isMobile, height, width} = useMobile();
    const landscape = height < width;
    const elementWidth = landscape ? `${Math.min(height, width) - 196}px` :  `${Math.min(height, width) - 104}px`;

    return (
        <div className="tree-menu unloaded" style={isMobile?{width: elementWidth, margin: landscape ? '22px' : '92px 52px 52px 52px'}:{}}>
            <Tree />
        </div>
    );
}

function Tree() {
    return (
        <div className="tree">
            <img src="/the-book.jpg"></img>
        </div>
    );
}

function Leaf({fraction, content}) {
    const { isMobile } = useMobile();
    const [rotation, setRotation] = useState(0);

    if (!fraction||!fraction.num&&typeof fraction.num !== 'number'||!fraction.den&&typeof fraction.den !== 'number') { //type checking
        throw new Error('fraction must be a JSON with 2 properties {num: number, den: number}');
    }
    const { num, den } = fraction

    if (!content||!content.icon||!content.title||!content.link) {
        throw new Error('content must include an icon, title and description field\ncontent:{\n\ticon: string,\n\ttitle: string,\n\tdescription: string}');
    }
    const { icon, title, link } = content


    useEffect(()=>{        
        const rotate = () => {
            let deg = 360 * num/den;
            setRotation(deg);
        }
        rotate();
    },[fraction])
    //on load rotate leaf box i/n * 360 degrees
    //rotate leaf inversesly -i/n * 360 degrees
    // const transformation = `rotate(${antiRotation(360*num/den)})\
    //                         translateX(${carteFromAngle(fraction, 90).x}%) translateX(${carteFromAngle(fraction, 80).x}px)
    //                         translateY(${-1*carteFromAngle(fraction, 90).y}%) translateY(${-1*carteFromAngle(fraction, 80).y}px)`;
    return (
        <div className="leaf-box" style={{transform: `rotate(${rotation}deg)`}} >
            <Link href={link} className="leaf" style={{transform: `rotate(-${rotation}deg)`}}>
                <img className='rotate-img' src={icon} style={{width: isMobile?'32px':'56px'}}/>
                {title}
            </Link>
        </div>
    );
}//, padding: 0


export default function TreeMenu() {
    const { user, meta } = useAuth();
    const [loaded, setLoaded] = useState(false);

    useEffect(()=>{
        setLoaded(true);
    }, [meta])

    if (loaded) {
        if ((meta && meta.constructor === Object && Object.keys(meta).length > 0) && meta.commish) {
            //user logged in, AND is a commishioner
            return <CommissionerTree />;
        }
        else if ((meta && meta.constructor === Object && Object.keys(meta).length > 0) && !meta.commish) {
            //user logged in, but is not a commissioner
            return <UserTree />
        } else {
            //user isnt logged in
            return (
                <LoginTree />
            );
        }
    } else {
        return (
            //this is inital state
            <UnloadedTree />
        );
    }
}