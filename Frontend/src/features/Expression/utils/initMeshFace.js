// utils/initFaceMesh.js

/**
 * @description Initializes the MediaPipe FaceMesh and camera, and sets up the results callback.
 * @param {Object} params - The parameters for initialization.
 * @param {React.RefObject} params.videoRef - Ref to the video element.
 * @param {React.RefObject} params.faceMeshRef - Ref to store the FaceMesh instance.
 * @param {React.RefObject} params.cameraRef - Ref to store the Camera instance.
 * @param {Function} params.onResults - Callback function to handle results from FaceMesh.
 * @returns {Function} Cleanup function to stop the camera when the component unmounts.
 */

export const initFaceMesh = ({
  videoRef,
  faceMeshRef,
  cameraRef,
  onResults,
}) => {
  // Create FaceMesh instance
  faceMeshRef.current = new window.FaceMesh({
    locateFile: (file) =>
      `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
  });

  // Configure FaceMesh
  faceMeshRef.current.setOptions({
    maxNumFaces: 1,
    refineLandmarks: true,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5,
  });

  // Attach result callback
  faceMeshRef.current.onResults(onResults);

  // Initialize camera
  if (videoRef.current) {
    cameraRef.current = new window.Camera(videoRef.current, {
      onFrame: async () => {
        // Manual detection only
        // await faceMeshRef.current.send({ image: videoRef.current });
      },
      width: 640,
      height: 480,
    });

    cameraRef.current.start();
  }

  // Cleanup function
  return () => {
    if (cameraRef.current) {
      cameraRef.current.stop();
    }
  };
};
