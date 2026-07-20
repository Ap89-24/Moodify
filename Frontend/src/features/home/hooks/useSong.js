import { useContext } from "react";
import { getSongs } from "../services/song.api";
import { SongContext } from "../song.context";




export const useSong = () => {
    const context = useContext(SongContext);

    if (!context) {
        throw new Error("useSong must be used within a SongContextProvider");
    };

    const {songs , setSongs , loading , setLoading} = context;

    const handleGetSongs = async ({mood}) => {
        setLoading(true);
        try {
            const data = await getSongs({mood});
            setSongs(data.song);
        } catch (error) {
            console.error("Error fetching songs:", error);
        } finally {
            setLoading(false);
        }
    };

    return ({loading , songs , handleGetSongs});
};