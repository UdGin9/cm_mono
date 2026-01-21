import { BrowserRouter, Route,  Routes } from "react-router"
import { HomePage } from "./pages/HomePage/HomePage"
import { VoltagePage } from "./pages/VoltagePage/VoltagePage"

export const Router = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<HomePage/>}/>
                <Route path='/voltage' element={<VoltagePage/>}/>
            </Routes> 
        </BrowserRouter>
    )
}