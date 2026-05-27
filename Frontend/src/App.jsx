
import {RouterProvider} from "react-router";
import "../src/shared/style/global.scss";
//import FaceMood from './features/Expression/components/FaceMood'
import router from "./app.routes";
import { AuthContextProvider } from "./features/auth/Provider/AuthProvider";


function App() {

  return (
    
    /**
     * @description: The AuthContextProvider is used to provide the authentication context to the entire application. This allows any component within the application to access the authentication context and determine if a user is logged in or not, as well as access user information and loading state.
     */

    <AuthContextProvider>
    <RouterProvider router={router} />
    </AuthContextProvider>
  )
}

export default App
