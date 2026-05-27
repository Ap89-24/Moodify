export const detectMoodFromLandmarks = (landmarks) => {
  // 📍 Face width
  const faceWidth = Math.abs(landmarks[454].x - landmarks[234].x);

  // 📍 Mouth
  const leftMouth = landmarks[61];
  const rightMouth = landmarks[291];
  const topLip = landmarks[13];
  const bottomLip = landmarks[14];

  // 📍 Eyes
  const leftEyeTop = landmarks[159];
  const leftEyeBottom = landmarks[145];
  const rightEyeTop = landmarks[386];
  const rightEyeBottom = landmarks[374];

  // 📍 Eyebrows
  const leftEyebrow = landmarks[65];
  const rightEyebrow = landmarks[295];

  // 📏 Raw normalized values
  const mWidth = Math.abs(rightMouth.x - leftMouth.x) / faceWidth;
  const mHeight = Math.abs(topLip.y - bottomLip.y) / faceWidth;

  const eyeOpen =
    (Math.abs(leftEyeTop.y - leftEyeBottom.y) +
      Math.abs(rightEyeTop.y - rightEyeBottom.y)) /
    2 /
    faceWidth;

  const browDist =
    (Math.abs(leftEyebrow.y - leftEyeTop.y) +
      Math.abs(rightEyebrow.y - rightEyeTop.y)) /
    2 /
    faceWidth;

  // 📍 Mouth curve
  const mouthCenterY = (topLip.y + bottomLip.y) / 2;
  const mouthCornerY = (leftMouth.y + rightMouth.y) / 2;
  const mouthCurve = (mouthCornerY - mouthCenterY) / faceWidth;

  // =========================
  // 🔧 NORMALIZATION (0 → 1)
  // =========================
  const clamp = (v, min = 0, max = 1) => Math.max(min, Math.min(max, v));

  const nMouthWidth = clamp((mWidth - 0.2) / 0.2);
  const nMouthHeight = clamp((mHeight - 0.01) / 0.05);
  const nEyeOpen = clamp((eyeOpen - 0.01) / 0.03);
  const nBrowDist = clamp((browDist - 0.015) / 0.03);
  const nMouthCurve = clamp((mouthCurve + 0.02) / 0.04);
  // sad = high, happy = low (negative curve)

  // =========================
  // 🎯 SCORING SYSTEM
  // =========================
  const scores = {
    happy:
      nMouthWidth * 0.5 + // smile width
      Math.max(0, 0.3 - nMouthCurve) * 0.4 + // upward curve ONLY
      nEyeOpen * 0.1, // small influence

    surprised: nMouthHeight * 0.6 + nEyeOpen * 0.4,

    angry:
      // eyebrows lowered (strong signal)
      (1 - nBrowDist) * 0.5 +
      // eyes slightly closed (angry squint)
      (1 - nEyeOpen) * 0.2 +
      // lips tight (not open)
      (1 - nMouthHeight) * 0.15 +
      // mouth not smiling
      (1 - nMouthWidth) * 0.1 +
      // slight downward curve helps
      nMouthCurve * 0.05,

    sad:
      nMouthCurve * 0.6 + // corners down
      (1 - nEyeOpen) * 0.4,

    neutral:
      1 -
      (nMouthHeight * 0.4 + // mouth not open
        Math.abs(nMouthCurve) * 0.3 + // no strong curve
        nEyeOpen * 0.3), // eyes normal (not wide)
  };

 

  // =========================
  // 🧠 PICK BEST
  // =========================
  const mood = Object.keys(scores).reduce((a, b) =>
    scores[a] > scores[b] ? a : b,
  );

  return {
    mood,
    scores,
  };
};
