
import FaceMood from '../../Expression/components/FaceMood'
import Player from '../components/Player';
import { useSong } from '../hooks/useSong';
import "../styles/home.scss";


const Home = () => {
  const {handleGetSongs} = useSong();
  return (
    <div className='home'>
      <FaceMood onClick={(expression) => {handleGetSongs({mood: expression})}} />
      <Player />
    </div>
  )
}

export default Home
