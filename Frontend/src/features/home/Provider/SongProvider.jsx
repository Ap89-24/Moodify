import { useState } from "react";
import { SongContext } from "../song.context";



export const SongContextProvider = ({children}) => {
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(true);

    return (
        <SongContext.Provider value={{songs , setSongs , loading , setLoading}}>
           {children}
        </SongContext.Provider>
    )
};