import { Router } from "./routes";
import { ToastContainer } from "react-toastify";
import { Header } from "./layout/header/header";
import { BrowserRouter } from "react-router";
import { useVoltageEvents } from "./hooks/useVoltageEvents";

function App() {
  useVoltageEvents();

  return (
    <BrowserRouter>
      <Header/>
      <Router/>
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;
