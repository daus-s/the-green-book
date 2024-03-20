//protect the aspect ratio of the phone by matching the rotation of the phone
import { useEffect, useRef, useState } from 'react';
import { useMobile } from './providers/MobileContext';


export default function RotationProvider({ props, children }) {
    //rotation logic from https://stackoverflow.com/questions/3501510/blocking-device-rotation-on-mobile-web-pages

  const [deviceRotation, setDeviceRotation] = useState(null);
  const [displayRotation, setDisplayRotation] = useState(0);
  const { isMobile } = useMobile();
  const rotationRef = useRef(null);
    
  useEffect(() => {
      if (screen) {
        setDeviceRotation(screen.orientation);
      }

      const handleOrientationChange = (event) => {
          const { orientation } = event.target;
          console.log(`rotated to ${orientation}°`);
          let newRotation = 0;
          setDisplayRotation(orientation)
          let Δφ = deviceRotation - orientation;
  
          rotate(rotationRef.current, Δφ);
        window.rotation = newRotation;
      };

    const rotate = (element, degrees) => {
      const transform = `rotate(${degrees}deg)`;
      const styles = {
        transform: transform
      };
      Object.assign(element.style, styles);
      setDisplayRotation((prev)=>prev+degrees);
    };

    window.addEventListener('orientationchange', handleOrientationChange);
    window.addEventListener('resize', handleOrientationChange);

    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange);
      window.removeEventListener('resize', handleOrientationChange);
    };
  }, []); 

    if (isMobile) {
        return (
            <div className="rotation-protector" ref={rotationRef} style={{width: '100%', height: ' 100%'}}>
                {children}
            </div>
        );
    } else {
        return children;
    }
}