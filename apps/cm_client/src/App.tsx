import { Router } from "./routes";
import { ToastContainer } from "react-toastify";
import { Header } from "./layout/header/header";
import { BrowserRouter } from "react-router";

function App() {

  return (
    <BrowserRouter>
      <Header/>
      <Router/>
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;
