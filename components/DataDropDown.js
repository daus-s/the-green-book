import { useState, useEffect, useRef } from "react";
import { height } from "../functions/VariableLengths";
import { useMobile } from "./providers/MobileContext";

function DropDownItem({ data, onClick }) {
    return (
        <div className="drop-down-item" onClick={onClick}>
            {JSON.stringify(data)}
        </div>
    );
}

export default function DataDropDown({ list, JSX, set, data, preload }) {
    const [visible, setVisible] = useState(false);
    const [display, setDisplay] = useState(undefined);
    const { width } = useMobile();
    const ref = useRef();

    useEffect(() => {
        if (preload) {
            setDisplay(data);
        }
    }, [preload, data]);

    useEffect(() => {
        if (!display && data) {
            setDisplay(data);
        }
    }, [data]);

    useEffect(() => {
        set(display);
    }, [display]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                if (visible) {
                    setVisible(false);
                }
            }
        };
        const handleEscapePressed = (event) => {
            if (event.key === "Escape") {
                if (visible) {
                    setVisible(false);
                }
            }
        };
        document.addEventListener("click", handleClickOutside);
        document.addEventListener("keydown", handleEscapePressed);

        return () => {
            document.removeEventListener("click", handleClickOutside);
            document.removeEventListener("keydown", handleEscapePressed);
        };
    }, [visible]);

    const leClick = (item) => {
        if (item) setDisplay(item);
        setVisible(false);
    };

    if (JSX) {
        return (
            <div className="drop-down-selector" ref={ref}>
                <JSX
                    key={display?.index || display?.index ? display.index : -1}
                    data={display}
                    onClick={() => {
                        setDisplay(display);
                        setVisible((prev) => !prev);
                    }}
                    display={true}
                    direction={visible ? "down" : "left"}
                />
                {visible ? (
                    <div className="scroll-container" style={{ top: `${height(width)}px` }}>
                        {list.map((item, index) => {
                            return (
                                <JSX
                                    key={item?.index || item?.index === 0 ? item.index : index}
                                    data={item}
                                    onClick={() => leClick(item)}
                                    selected={display?.index ? display?.index === item?.index : display?.groupID ? display?.groupID === item?.groupID : false}
                                />
                            );
                        })}
                    </div>
                ) : (
                    <></>
                )}
            </div>
        );
    } else {
        return (
            <div className="drop-down-selector" ref={ref} style={{ marginRight: "20px" }}>
                <DropDownItem
                    key={display?.index || display?.index ? display.index : -1}
                    data={display}
                    onClick={() => {
                        setDisplay(display);
                        setVisible((prev) => !prev);
                    }}
                    display={true}
                    direction={visible ? "down" : "left"}
                ></DropDownItem>
                {visible ? (
                    <div className="scroll-container">
                        {list.map((item, index) => {
                            return <DropDownItem key={item?.index || item?.index === 0 ? item.index : index} data={item} onClick={() => leClick(item)} selected={display?.index === item?.index} />;
                        })}
                    </div>
                ) : (
                    <></>
                )}
            </div>
        );
    }
}
