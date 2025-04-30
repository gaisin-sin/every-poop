import { useNavigate, BrowserRouter as Router, Routes, Route} from "react-router-dom"
import { Home } from "./Home";
import { Login } from "./Login";

export const App = () => {
  return (
    <>
    <Router>
      <Routes>
        <Route path="/"  element={<Home />}/>
        <Route path="/Login" element={<Login />}/>
      </Routes>
    </Router>
    </>
  );
}