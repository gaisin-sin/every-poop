import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./CreatePoo.css"
import { faPoo } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { auth, db } from "./firebase";
import { addDoc, collection } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import uuid from "react-uuid";
export const CreatePoo = ({setModal}) => {
    const [inputText, setInput] = useState("");

    const navigate = useNavigate();
    const PooPost = async (Poo) => {

        if (Poo == "") {
            return;
        }
        let d = new Date();
        await addDoc(collection(db, "poops"), {
            Poo:Poo,
            Time:d.getTime(),
            author:{
                username:auth.currentUser.displayName,
                id:auth.currentUser.uid
            },
            pooid:uuid(),
        });
        setModal(false);
        navigate("/");
    }
    return (
        <>
        <div className="Createpoo">
            <textarea placeholder="入力してね💩" onChange={(e) => setInput(e.target.value)}></textarea>
            <div className="buttons">
                <button className="add-button" onClick={() => PooPost(inputText)}><FontAwesomeIcon icon={faPoo} /></button>
            </div>
        </div>
        </>
    );
}