import React from 'react'
import FaceMood from '../../Expression/components/FaceMood'
import Player from '../components/Player';
import { useSong } from '../hooks/useSong';


const Home = () => {
  const {handleGetSongs} = useSong();
  return (
    <div>
      <FaceMood onClick={(expression) => {handleGetSongs({mood: expression})}} />
      <Player />
    </div>
  )
}

export default Home
