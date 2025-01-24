import { useEffect, useRef, useState } from 'react';
import {GazeDataCollector} from '../services/utilities'


const gazeDataCollector = new GazeDataCollector();

const WebGazerComponent = ({ isEyeTrackingEnabled }) => {
  const webGazer = window.webgazer;
  const gazeListenerRef = useRef(null);
  const [isCompatible, setIsCompatible] = useState(false);
  const [error, setError] = useState(null);


  useEffect(() => {
    console.log("isEyeTrackingEnabled", isEyeTrackingEnabled);

    const initializeWebGazer = async () => {
      try {
        const isBrowserCompatible = webGazer.detectCompatibility();
        setIsCompatible(isBrowserCompatible);

        if (!isBrowserCompatible) {
          throw new Error("Browser is not compatible with WebGazer");
        }

        if (isEyeTrackingEnabled) {
          console.log("Starting eye tracking");

          // Define the gaze listener function
          gazeListenerRef.current = (data, elapsedTime) => {
            if (data == null) {
              console.log("Data is null", data);
              return;
            }
            var xprediction = data.x;
            var yprediction = data.y;
           // console.log(`Gaze at x: ${xprediction}, y: ${yprediction}`);
         //   console.log(`Elapsed time: ${elapsedTime}`);
            gazeDataCollector.addDataPoint(xprediction, yprediction, Number(elapsedTime));

            
              const finalPoints = gazeDataCollector.getFinalDataPoints();
              console.log(finalPoints);
            
          };

          /*
          // Show debug elements
          await webGazer.showVideo(true);
          await webGazer.showFaceOverlay(true);
          await webGazer.showFaceFeedbackBox(true);
          */
          // Set up WebGazer
          await webGazer.setGazeListener(gazeListenerRef.current).begin();


          console.log("WebGazer initialized successfully");
        }
      } catch (err) {
        console.error("Error initializing WebGazer:", err);
        setError(err.message);
      }
    };

    initializeWebGazer();

    // Cleanup function
    return () => {
      if (gazeListenerRef.current) {
        console.log("Cleaning up eye tracking");
        webGazer.clearGazeListener();
        webGazer.end();
        webGazer.showVideo(false);
        webGazer.showFaceOverlay(false);
        webGazer.showFaceFeedbackBox(false);
      }
    };
  }, [isEyeTrackingEnabled]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!isCompatible) {
    return <div>Your browser is not compatible with WebGazer</div>;
  }

  return (
    <div>
      <h2>WebGazer Component</h2>
      <p>Eye tracking is {isEyeTrackingEnabled ? 'enabled' : 'disabled'}</p>
      {/* You can add more UI elements here */}
    </div>
  );
};

export default WebGazerComponent;
