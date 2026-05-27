import FormGroup from "../components/FormGroup";
import "../style/login.scss";
import { Link } from "react-router";

const Login = () => {
  return (
     <main className="login-page">
        <div className="form-container">
            <h1>Login</h1>
            <form>
                <FormGroup label="email" placeholder="Enter your email" />
                <FormGroup label="password" placeholder="Enter your password" />
                <button className="button" type="submit">Login</button>
            </form>
            <p>Don't have an account? <Link to="/register">Register</Link></p>
        </div>
     </main>

  )
}

export default Login
