import { useEffect, useRef, useState, useCallback } from 'react';
import { GazeDataCollector } from '../services/utilities';
import Modal from './Modal';
import ModalContent from './ModalContent';

const gazeDataCollector = new GazeDataCollector();

const WebGazerComponent = ({ isEyeTrackingEnabled, isShowFaceBox, isShowGazeDot, coordinates, item, summary }) => {
  const webGazer = window.webgazer;
  const gazeListenerRef = useRef(null);
  const [isCompatible, setIsCompatible] = useState(false);
  const [error, setError] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalOpenTimeRef = useRef(0);
  const lastElapsedTimeRef = useRef(0);
  const intervalId = useRef(null);
  const [lowEngagementScore, setLowEngagementScore] = useState(0);

  // Opens modal and pauses WebGazer.
  const openModal = () => {
    setIsModalOpen(true);
    webGazer.pause();
    console.log("WebGazer paused");
    modalOpenTimeRef.current = Date.now();
  };

  // Closes modal, resumes WebGazer, and the engagement interval will be restarted by the useEffect.
  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    const modalOpenDuration = (Date.now() - modalOpenTimeRef.current) / 1000;
    lastElapsedTimeRef.current += modalOpenDuration;
    webGazer.resume();
    console.log("WebGazer resumed");
  }, []);

  if (!webGazer) return null;

  // Initialize WebGazer.
  useEffect(() => {
    const initializeWebGazer = async () => {
      if (!webGazer || isInitialized) return;

      try {
        const isBrowserCompatible = webGazer.detectCompatibility();
        setIsCompatible(isBrowserCompatible);

        if (!isBrowserCompatible) {
          throw new Error('Browser is not compatible with WebGazer');
        }

        await webGazer.begin();
        setIsInitialized(true);
        console.log('WebGazer initialized successfully');
      } catch (err) {
        console.error('Error initializing WebGazer:', err);
        setError(err.message);
      }
    };

    initializeWebGazer();

    return () => {
      if (isInitialized) {
        console.log('Cleaning up WebGazer');
        webGazer.clearGazeListener();
        webGazer.showVideo(false);
        webGazer.showFaceOverlay(false);
        webGazer.showFaceFeedbackBox(false);
        webGazer.showPredictionPoints(false);
        webGazer.end();
      }
    };
  }, []);

  // Handle face box visibility.
  useEffect(() => {
    if (isInitialized) {
      handleFaceBox(isShowFaceBox);
    }
  }, [isInitialized, isShowFaceBox]);

  // Handle gaze dot visibility.
  useEffect(() => {
    if (isInitialized) {
      handleGazeDot(isShowGazeDot);
    }
  }, [isInitialized, isShowGazeDot]);

  // Set gaze listener and update gaze data.
  useEffect(() => {
    if (isInitialized && isEyeTrackingEnabled) {
      console.log('Starting eye tracking');
      gazeDataCollector.setAOI(coordinates);

      gazeListenerRef.current = (data, elapsedTime) => {
        if (data == null) {
          console.log('Data is null', data);
          return;
        }
        const xprediction = data.x;
        const yprediction = data.y;


        gazeDataCollector.addDataPoint(xprediction, yprediction, Number(elapsedTime));
        const elapsedTimeInSeconds = parseFloat(Math.floor(elapsedTime / 1000).toFixed(2));

      };

      webGazer.setGazeListener(gazeListenerRef.current);
    }

    return () => {
      if (gazeListenerRef.current) {
        webGazer.clearGazeListener();
        webGazer.end();
      }
    };
  }, [isInitialized, isEyeTrackingEnabled, coordinates]);

  // Engagement interval: runs every 10 seconds when modal is closed, tracking is enabled, and WebGazer is initialized.
  useEffect(() => {
    // When modal is open, clear the interval.
    if (isModalOpen || !isInitialized || !isEyeTrackingEnabled) {
      clearInterval(intervalId.current);
      intervalId.current = null;
      return;
    }
    // Start (or restart) the engagement interval.
    intervalId.current = setInterval(() => {
      const result = analyzeGazeData();

      // Open modal if engagement score drops below threshold.
      if (result.engagementScore < 0.5) {
        setLowEngagementScore(result.engagementScore)
        openModal();
      }
    }, 10000);

    // Cleanup on unmount or dependency change.
    return () => {
      clearInterval(intervalId.current);
      intervalId.current = null;
    };
  }, [isModalOpen, isInitialized, isEyeTrackingEnabled]);

  const handleFaceBox = async (isShowFaceBox) => {

    if (isShowFaceBox) {

      await webGazer.showVideo(true);
      await webGazer.showFaceOverlay(true);
      await webGazer.showFaceFeedbackBox(true);
    } else {

      await webGazer.showVideo(false);
      await webGazer.showFaceOverlay(false);
      await webGazer.showFaceFeedbackBox(false);

      const videoElementContainer = document.getElementById('webgazerVideoContainer');
      if (videoElementContainer) {
        videoElementContainer.style.display = 'none';
      }
    }
  };

  const handleGazeDot = async (isShowGazeDot) => {
    console.log('Updating gaze dot visibility:', isShowGazeDot);
    await webGazer.showPredictionPoints(isShowGazeDot);
  };

  const analyzeGazeData = () => {
    const finalFixations = gazeDataCollector.getFixations();


    const totalFixationDuration = gazeDataCollector.getTotalFixationDuration();


    const avgFixationDuration = gazeDataCollector.getAverageFixationDuration();


    const fixationsInParagraph = gazeDataCollector.getFixationsInAOI();


    const paragraphDensity = gazeDataCollector.getFixationDensity();


    const engagementScore = gazeDataCollector.getEngagementScore();


    return {
      finalFixations,
      totalFixationDuration,
      avgFixationDuration,
      fixationsInParagraph,
      paragraphDensity,
      engagementScore,
    };
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!isCompatible) {
    return <div>Your browser is not compatible with WebGazer</div>;
  }

  return (
    <div>
      <div className="p-4">
        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          onAfterOpen={() => console.log('Modal opened')}
        >
          <ModalContent
            title=""
            engagementScore = {lowEngagementScore}
            closeModal={closeModal}
            onOkay={closeModal}
            data={{ item, summary }}
          ></ModalContent>
        </Modal>
      </div>
    </div>
  );
};

export default WebGazerComponent;
