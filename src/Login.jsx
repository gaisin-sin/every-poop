import { faPoop, faPoo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Login.css";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "./firebase";
import { useNavigate } from "react-router-dom";
export const Login = () => {
    const Npoop = (<FontAwesomeIcon icon={faPoop}/>)
    const Mpoop = (<FontAwesomeIcon icon={faPoo} className="MPOOP" />)
    const navigate = useNavigate();
    const LoginFunc = async() => {
        signInWithPopup(auth, provider).then((result) => {
            localStorage.setItem("logined", true);
            navigate("/");
        })
    }
    return (
        <>
        <div className="LoginScreen">
        <div className="LoginContainer">
            <h2>ようこそ!</h2>
            <h1>Every Poop <span className="MPOOP">💩</span>へ</h1>
            <button className="login-button" onClick={() => LoginFunc()} >Login</button>
        </div>
        </div>
        </>
    );
}