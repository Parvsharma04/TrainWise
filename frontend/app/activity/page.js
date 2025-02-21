"use client";

import { useRef, useEffect, useState } from "react";
import io from "socket.io-client";

export default function Activity() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const [socket, setSocket] = useState(null);
  const [activityStarted, setActivityStarted] = useState(false);
  const [reps, setReps] = useState(0);
  const [timeInSec, setTimeInSec] = useState(0);

  useEffect(() => {
    const newSocket = io("http://localhost:8000");

    newSocket.on("connect", () => {
      console.log("Connected to server!");
      setSocket(newSocket);
    });

    newSocket.on("disconnect", () => {
      console.log("Disconnected from server");
      setSocket(null);
    });

    newSocket.on("trackingData", (data)=>{
      setReps(data.pushup_count)
    })

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    const getVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
      }
    };

    let timeInterval = setInterval(()=>{
      setTimeInSec(prev=>prev+1);
    }, 1000)


    getVideo();
  }, []);

  useEffect(() => {
    if (!activityStarted || !videoRef.current || !canvasRef.current || !socket)
      return;

    const captureFrame = () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataURL = canvas.toDataURL("image/jpeg", 0.8);

      socket.emit("videoFrame", dataURL);
    };

    const frameInterval = setInterval(captureFrame, 100); // Send frame every 100ms

    return () => clearInterval(frameInterval);
  }, [activityStarted, socket]);

  function startActivity() {
    console.log("Activity started!");
    if (socket) {
      socket.emit("startTracking");
    }
    setActivityStarted(true);
  }

  return (
    <div className="font-['general'] z-50">
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        style={{ width: window.innerWidth, height: window.innerHeight}}
        className=""
      ></video>

      {!activityStarted && (
        <div className="fixed inset-0 flex items-center justify-center">
          <button
            className="bg-[#0056F1] text-white px-3 py-2"
            onClick={startActivity}
          >
            Start
          </button>
        </div>
      )}

      {activityStarted && (
        <div className="fixed inset-0 font-['general'] p-2">
        
        <div>
        <span className="text-2xl">Current reps: {reps}</span>
        </div>

        <div className="fixed bottom-0 right-0">
        <span>Current workout: Pushups</span>
          </div>

          <div className="fixed top-0 right-0 text-5xl">
        <span>{Math.round(timeInSec/60<=9)?"0"+Math.round(timeInSec/60):Math.round(timeInSec/60)}:{Math.round(timeInSec%60)<=9?"0"+timeInSec%60:timeInSec%60}</span>
          </div>
        </div>
      )
      }

      <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
    </div>
  );
}