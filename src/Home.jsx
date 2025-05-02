import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { faPoop, faPoo } from "@fortawesome/free-solid-svg-icons";
import "./Home.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CreatePoo } from "./CreatePoo";
import { addDoc, collection, doc, getDocs, onSnapshot } from "firebase/firestore";
import { auth, db } from "./firebase";
import { PooCard } from "./PooCard";
import uuid from "react-uuid";








export const Home = () => {



    const [allPoo, setAllPoo] = useState([]);

    const [showPoo, setShowPoo] = useState([]);


    const [superunko, setSuperUnko] = useState((<span className="unkos">💩</span>));






    const [nowMode, setMode] = useState(0);

    const navigate = useNavigate();


    const [logs, setLogs] = useState([]);

    

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

    const getLogs = async() => {
        const data = await getDocs((collection(db, "logs")));
        const alldata = (data.docs.map((doc) => ({...doc.data(), id:doc.id})));
        setLogs(alldata);
    }

    getPoo();
    getLogs();

    console.log("SIZE " + allPoo.length);

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
                    const news = [x.doc.data(), ...filtering].sort((a, b) => b.Time-a.Time);
                    return news;
                });
            }
        })
    });


    onSnapshot(
        collection(db, "logs"), (data) => {
        data.docChanges().map((x) => {
            if (x.type == "added") {
                console.log("ADD LOG");
                setLogs((dt) => [x.doc.data(), ...dt]);
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
                },
                pooid:uuid(),
            });
            setModal(false);
        }
    


    const SUPERUNKO = () => {
        PooPost("排便成功💩✌")
        const text = "💩";
        console.log(text.split(""));
        setSuperUnko((<span className="unkos_super">💩</span>));
    }

    //Log shori
    const LogInc = async (userid, pooid) => {
        const GETLOGS = async() => {
            const data = await getDocs((collection(db, "logs")));
            const alldata = (data.docs.map((doc) => ({...doc.data(), id:doc.id})));
            return alldata;
        }
        let newlogs =  await  GETLOGS();
        let ret = false;
        newlogs.map((obj) => {
            if (obj.userid == userid && obj.pooid == pooid) {
                ret = true;
            }
        });
        console.log("RET " + ret);
        return ret;
    }



    const CountView = async (pooid) => {
        const GETLOGS = async() => {
            const data = await getDocs((collection(db, "logs")));
            const alldata = (data.docs.map((doc) => ({...doc.data(), id:doc.id})));
            return alldata;
        }
        let newlogs =  await  GETLOGS();
        var userset = new Set();
        newlogs.map((obj) =>  {
            if (obj.pooid == pooid) {
                userset.add(obj.userid);
            }
        });
        return userset.size;
    }
    const createLog = async (userid, pooid) => {

        console.log("CREATING");
        const newobj = {
            userid:userid,

            pooid:pooid,
        }
        console.log("NEW ");
        console.log(newobj);
        await addDoc(collection(db, "logs"), newobj);
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
                <div onClick={() => setMode(0)} className={"mode" + (nowMode==0 ? "-click" :  "")}>みんなのぷー</div>
                <div onClick={() => setMode(1)} className={"mode" + (nowMode==1 ? "-click" :  "")}>僕のぷー</div>
            </div>
            <div className="Viewer">
                <div className="Titles">
                {superunko}{superunko}{superunko}
                </div>
                <div className="PoopContainer">
                    {(showPoo).map((obj) => {
                        return (
                            <PooCard obj={obj} showPoo={showPoo} LogInc={LogInc} createLog={createLog} CountView={CountView} logs={logs}/>
                        );
                    })}
                </div>
            </div>
        </div>
        </>
    );
}