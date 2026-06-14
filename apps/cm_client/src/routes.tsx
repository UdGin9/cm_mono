import { Route,  Routes } from "react-router"
import { HomePage } from "./pages/HomePage/HomePage"
import { VoltagePage } from "./pages/VoltagePage/VoltagePage"
import { Navigate } from "react-router"

export const Router = () => {

    return (
            <Routes>
                <Route path='/' element={<HomePage/>}/>
                <Route path='/voltage' element={<VoltagePage/>}/>
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes> 
    )
}