import { useEffect, useRef, useState } from "react";
import { detectMoodFromLandmarks } from "../utils/detectmood";
import { moodEmoji } from "../utils/emojidetect";
import "../styles/facemood.scss";
import { initFaceMesh } from "../utils/initMeshFace";



const FaceMood = ({ onClick = () => {} }) => {
  const videoRef = useRef(null);
  const cameraRef = useRef(null);
  const [mood, setMood] = useState("neutral");
  const [scores, setScores] = useState({});
  const faceMeshRef = useRef(null);

  const onResults = (results) => {
    // ✅ safe check
    if (
      !results.multiFaceLandmarks ||
      results.multiFaceLandmarks.length === 0
    ) {
      return;
    }

    const landmarks = results.multiFaceLandmarks[0];

    const detectedMood = detectMoodFromLandmarks(landmarks);

    setMood(detectedMood.mood);
    setScores(detectedMood.scores);
  };

  // 🧠 mood smoothing buffer
  useEffect(() => {
    const cleanup = initFaceMesh({
      videoRef,
      faceMeshRef,
      cameraRef,
      onResults,
    });

    return cleanup;
  }, []);

  const handleDetect = async () => {
    if (videoRef.current && faceMeshRef.current) {
      await faceMeshRef.current.send({
        image: videoRef.current,
      });
    }
    onClick(detectedMood.mood);
  };

  return (
    <div className="face">
      <video ref={videoRef} autoPlay muted playsInline />
      <h1>
        Mood: {moodEmoji[mood]} {mood}
      </h1>
      {/* 🔥 Add this here */}
      <div>
        {Object.entries(scores).map(([key, value]) => (
          <div key={key}>
            {key}: {value.toFixed(2)}
          </div>
        ))}
      </div>
      <button onClick={handleDetect} className="btn">
        Detect Expression
      </button>
    </div>
  );
};

export default FaceMood;
