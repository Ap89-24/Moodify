
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router';

const Protected = ({children}) => {

    const {loading,user} = useAuth();
    const navigate = useNavigate();
    
    if(loading) {
        return <h1>Loading...</h1>
    };

    if(!loading || !user) {
        navigate("/login");
    };

  return children;
}

export default Protected
