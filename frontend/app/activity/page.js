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

    newSocket.on("trackingData", (data) => {
      console.log(data);
      if (data.pushup_count) setReps(data.pushup_count);
    });

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

    let timeInterval = setInterval(() => {
      setTimeInSec((prev) => prev + 1);
    }, 1000);

    return () => {
      clearInterval(frameInterval);
      clearInterval(timeInterval);
    };
  }, [activityStarted, socket]);

  function startActivity() {
    if (activityStarted) {
      setActivityStarted(false);
      console.log("Activity stoped!");
      socket?.emit("stopTracking");
      setTimeInSec(0);
      setReps(0);
    } else {
      console.log("Activity started!");
      setActivityStarted(true);
      socket?.emit("startTracking");
    }
  }

  return (
    <div className="font-['general'] z-50 flex">
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        style={{ width: window.innerWidth - 200, height: window.innerHeight }}
        className=""
      ></video>
      <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
      <div className="p-3 bg-[#fff] grow-1 m-4 rounded-xl flex flex-col justify-between">
        <div>
          <h3 className="text-2xl">Excercise tracker</h3>

          <div className="text-sm text-center m-4 p-2 outline outline-1 outline-[#888] rounded">
            <span className="text-3xl block">
              {Math.round(timeInSec / 60 <= 9)
                ? "0" + Math.round(timeInSec / 60)
                : Math.round(timeInSec / 60)}
              :
              {Math.round(timeInSec % 60) <= 9
                ? "0" + (timeInSec % 60)
                : timeInSec % 60}
            </span>
          </div>

          <div className="text-sm text-center m-4 p-2 outline outline-1 outline-[#888] rounded">
            <span className="text-3xl block">{reps}</span>
            reps
          </div>
        </div>
        <div>
          <button
            className="bg-[#0056F1] text-white px-3 py-2 w-[100%]"
            onClick={startActivity}
          >
            {!activityStarted ? "Start" : "Stop"}
          </button>
        </div>
      </div>
    </div>
  );
}
