import { useState } from "react";
import FormGroup from "../components/FormGroup"
import "../style/register.scss";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";

const Register = () => {

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const {loading,registerUser} = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        await registerUser({username, email, password});
        navigate("/");
    };

  return (
          <main className="register-page">
        <div className="form-container">
            <h1>Register</h1>
            <form onSubmit={handleSubmit}>
                <FormGroup
                value={username} 
                onChange={(e) => setUsername(e.target.value)}
                label="username"
                 placeholder="Enter your username"
                  />
                <FormGroup 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                label="email"
                placeholder="Enter your email"
                 />
                <FormGroup 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                label="password"
                placeholder="Enter your password"
                 />
                <button className="button" type="submit">
                    {loading ? "Registering..." : "Register"}
                </button>
            </form>
            <p>Already have an account? <Link to="/login">Login</Link></p>
        </div>
     </main>
  )
}

export default Register
