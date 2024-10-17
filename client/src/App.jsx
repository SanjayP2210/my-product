import {
  BrowserRouter as Router
} from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
// import "./assets/css/styles.css";
import "./index.css";
import AppRouter from "./router/AppRouter.jsx";

function App() {
  return (
    <>
      <Router>
        <AppRouter />
      </Router>
      <div className="dark-transparent sidebartoggler"></div>
    </>
  );
}

export default App;
