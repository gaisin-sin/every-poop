import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./PooCard.css"
import { faEye, faFaceAngry, faPoop } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useReducer, useRef, useState } from "react";
import { auth } from "./firebase";
export const PooCard = ({obj, showPoo, LogInc, createLog, CountView, logs} ) => {
    
    const targetRef = useRef(null);

    const [styleNew, setStyle] = useState(true);
    const [nowCount, setCount] = useState(0);


    useEffect(() => {
        const RUN = async() =>  {
            const count_ret = await CountView(obj.pooid);
            console.log("RES " + count_ret);
            setCount(count_ret);
        }
        RUN();
    }, [logs]);
    useEffect(() => {
        console.log("EFFE CT DAYO");

    

        if (!targetRef.current) return;
        const oberserver = new IntersectionObserver(([entry]) => {
            const JUDGIN = async() => {
            if (entry.isIntersecting) {
               const rests = await LogInc(auth.currentUser.uid, obj.pooid);
                if (rests) {
                    console.log("SAW SUDENIMITEA " + obj.Poo + " " + rests);
                    setStyle(false); 
                } else {
                    setStyle(true);
                    console.log("SAW HAJIMETE " + obj.Poo);
                    createLog(auth.currentUser.uid, obj.pooid);
                }
                const count_ret = await CountView(obj.pooid);
                console.log("RES " + count_ret);
                setCount(count_ret);
            }
            }
            JUDGIN();
        },
        {
            threshold:0.5,
        }
    );


    oberserver.observe(targetRef.current);

    return () => {
        oberserver.disconnect();
    }
    }, [showPoo]);
    return (
        <>
        <div className={"PooCard" + (styleNew ?  "-new-notif" : "")} ref={targetRef}>
            <div className="username">
            <FontAwesomeIcon icon={faFaceAngry}  className="ANGRY" /> from    {obj.author.username}💩
            </div> 
            {styleNew && (
                <>
                <div className="new-notif">
                N💩W  
                </div>
                </>
             
            )}
          
            <div className="Contents">
               {obj.Poo.split("\n").map((x) => {
                    return (
                        <>
                        {x}
                        <br />
                        </>
                    );
                })}
            </div>
            <div className="ShowDate">
                {new Date(obj.Time).toLocaleDateString("ja-JP",{
                    hour:"2-digit",
                    minute:"2-digit",
                })}
            </div>
            <div className="ViewCount">
            <FontAwesomeIcon icon={faEye}/>{nowCount}  💩!
            </div>  
        </div>
        </>
    );
}