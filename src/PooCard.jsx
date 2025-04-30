import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./PooCard.css"
import { faFaceAngry } from "@fortawesome/free-solid-svg-icons";
export const PooCard = ({obj}) => {
    return (
        <>
        <div className="PooCard">
            <div className="username">
            <FontAwesomeIcon icon={faFaceAngry}  className="ANGRY" /> from    {obj.author.username}💩
            </div>            
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
        </div>
        </>
    );
}