import { useEffect, useRef, useState } from "react";
import { useSong } from "../hooks/useSong";
import "./player.scss";

const Player = () => {
  const { songs: song } = useSong();
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [speed, setSpeed] = useState(1);

  const formatTime = (seconds) => {
    if (Number.isNaN(seconds) || !isFinite(seconds)) return "00:00";
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => setDuration(audio.duration);
    const onEnded = () => setPlaying(false);

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("ended", onEnded);
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.playbackRate = speed;
  }, [speed]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.pause();
    audio.load();
    setPlaying(false);
    setCurrentTime(0);
    setDuration(0);
  }, [song?.songUrl]);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (playing) {
      audio.pause();
      setPlaying(false);
      return;
    }

    try {
      await audio.play();
      setPlaying(true);
    } catch (error) {
      console.error("Unable to play audio", error);
      setPlaying(false);
    }
  };

  const seek = (offset) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    audio.currentTime = Math.max(0, Math.min(duration, audio.currentTime + offset));
  };

  return (
    <div className="player">
      <div className="player__header">
        <div>
          <h3 className="player__title">{song?.title || "No song loaded"}</h3>
          <p className="player__subtitle">
            {song?.mood ? `${song.mood} mood` : "Load a song to start playback"}
          </p>
        </div>
      </div>

      <div className="player__controls">
        <button
          className="player__button"
          onClick={() => seek(-5)}
          disabled={!song?.songUrl}
        >
          ◀︎ 5s
        </button>
        <button
          className="player__button player__button--play"
          onClick={togglePlay}
          disabled={!song?.songUrl}
        >
          {playing ? "Pause" : "Play"}
        </button>
        <button
          className="player__button"
          onClick={() => seek(5)}
          disabled={!song?.songUrl}
        >
          5s ▶︎
        </button>
      </div>

      <div className="player__status">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>

      <div className="player__speed">
        <label htmlFor="playback-speed">Speed</label>
        <select
          id="playback-speed"
          value={speed}
          onChange={(event) => setSpeed(Number(event.target.value))}
          disabled={!song?.songUrl}
        >
          <option value={0.5}>0.5×</option>
          <option value={0.75}>0.75×</option>
          <option value={1}>1×</option>
          <option value={1.25}>1.25×</option>
          <option value={1.5}>1.5×</option>
          <option value={2}>2×</option>
        </select>
      </div>

      <audio ref={audioRef} preload="metadata">
        {song?.songUrl && <source src={song.songUrl} type="audio/mpeg" />}
      </audio>
    </div>
  );
};

export default Player;
