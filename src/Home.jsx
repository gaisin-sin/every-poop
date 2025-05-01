import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { faPoop, faPoo } from "@fortawesome/free-solid-svg-icons";
import "./Home.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CreatePoo } from "./CreatePoo";
import { addDoc, collection, doc, getDocs, onSnapshot } from "firebase/firestore";
import { auth, db } from "./firebase";
import { PooCard } from "./PooCard";







export const Home = () => {

    const [allPoo, setAllPoo] = useState([]);

    const [showPoo, setShowPoo] = useState([]);






    const [nowMode, setMode] = useState(0);

    const navigate = useNavigate();


    

    useEffect(() => {
    const logined = localStorage.getItem("logined");
    if (!logined) {
        navigate("/Login");
    }

    const getPoo = async() => {
        const data = await getDocs((collection(db, "poops")));
        const alldata = (data.docs.map((doc) => ({...doc.data(), id:doc.id})));
        alldata.sort((a, b) => b.Time-a.Time);
        setAllPoo(alldata);
        setShowPoo(alldata);
    }

    getPoo();
    onSnapshot(
        collection(db, "poops"), (data) => {
        data.docChanges().map((x) => {
            if (x.type == "added") {
                console.log("ADDED", x.doc.data());

                const news = [x.doc.data(), ...allPoo].sort((a, b) => b.Time-a.Time);
               
                setAllPoo((dt) => {

                    const filtering = dt.filter((obj) => {
                        //console.log("COMP " + obj.Poo + " " + x.doc.data().Poo);
                        if (obj.Time != x.doc.data().Time) {
                            return obj;
                        }
                    }
                    );
                    console.log("CHCHCH ");
                    console.log(dt[0]);
                    console.log(x.doc.data())
                    console.log(dt[0].Time == x.doc.data().Time);
                    const news = [x.doc.data(), ...filtering].sort((a, b) => b.Time-a.Time);
                    return news;
                });
            }
        })
    });

    }, []);

    useEffect(() => {
        console.log("CH " + allPoo.length);
        const now_all = [...allPoo];
        if (nowMode == 0) {
            setShowPoo(now_all);
            return;
        } 
        const new_all = now_all.filter((obj) => {
            if (obj.author.id == auth.currentUser.uid) {
                return obj;
            }
        })
        setShowPoo(new_all);
        console.log("SHOW ");
        allPoo.map((x) =>  {
            console.log(x);
        });
        
    }, [nowMode, allPoo]);

    


    const [showModal, setModal] = useState(false);
    const UNKOS = (<span className="unkos">💩</span>);



    const PooPost = async (Poo) => {
    
            if (Poo == "") {
                return;
            }
            let d = new Date();
            await addDoc(collection(db, "poops"), {
                Poo:Poo,
                Time:d.getTime(),
                date:d,
                author:{
                    username:auth.currentUser.displayName,
                    id:auth.currentUser.uid
                }
            });
            setModal(false);
        }

    const SUPERUNKO = () => {
        PooPost("排便成功💩✌")
        alert("おめでとう！！！")
    }


    return (
        <>
        {showModal &&
        (
        <>
        <div className="ModalWindow" onClick={() => setModal(false)}></div>
        <CreatePoo setModal={setModal}/>
        </>
        )}
        <div className="to-add-button" onClick={() => setModal(true)}>
            +
            <br />
            💩
        </div>

        <div className="super-unko-button" onClick={() => SUPERUNKO()}>
            <span style={{color:"orange"}}>Sup</span><span style={{color:"aquamarine"}}>Er</span>💩TIME
        </div>
        <div className="Container">
            <div className="SideBar">
                <div className="ICON"><FontAwesomeIcon icon={faPoo} /></div>
                <div  onClick={() => setMode(0)} className={"mode" + (nowMode==0 ? "-click" :  "")}>みんなのぷー</div>
                <div onClick={() => setMode(1)} className={"mode" + (nowMode==1 ? "-click" :  "")}>僕のぷー</div>
            </div>
            <div className="Viewer">

                
                <div className="Titles">
                {UNKOS}{UNKOS}{UNKOS}
                </div>
                <div className="PoopContainer">
                    {(showPoo).map((obj) => {
                        return (
                            <PooCard obj={obj} />
                        );
                    })}
                </div>
            </div>
        </div>
        </>
    );
}