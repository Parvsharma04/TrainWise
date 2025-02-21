"use client";

import { useRef, useEffect, useState, useLayoutEffect } from "react";
import { Icon } from "@iconify/react";
<<<<<<< Updated upstream
import io from "socket.io-client";
=======
import { socket } from "../socket";
>>>>>>> Stashed changes

export default function Activity() {
  const videoRef = useRef(null);
  const [windowDimensions, setWindowDimensions] = useState({
    width: 0,
    height: 0,
  });

<<<<<<< Updated upstream
  const [socket, setSocket] = useState(null);

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
=======
  const [socketConnected, setSocketConnection] = useState(false);
>>>>>>> Stashed changes

  const [activityStarted, setActivityStarted] = useState(false);
  const [reps, setReps] = useState(0);
  const [timeInSec, setTimeInSec] = useState(0);

  function startActivity() {
    console.log("Activity started!");
<<<<<<< Updated upstream
    if (socket) {
      socket.emit("startTracking");
    }
    setActivityStarted(true);
  }

  useEffect(() => {
    if (!socket) {
      const newSocket = io("http://localhost:8000");

      newSocket.on("connect", () => {
        console.log("Connected to server!");
        setSocket(newSocket);
      });

      newSocket.on("disconnect", () => {
        console.log("Disconnect from server");
        setSocket(null);
      });
    }
  }, [socket]);

=======
    setActivityStarted(true);
  }

>>>>>>> Stashed changes
  useLayoutEffect(() => {
    console.log(window.innerWidth);

    setWindowDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }, []);

  useEffect(() => {
    const getVideo = async () => {
      try {
        console.log(windowDimensions);

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { windowDimensions },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
<<<<<<< Updated upstream
          if (socket) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const dataURL = canvas.toDataURL("image/jpeg");
            socket.emit("videoFrame", dataURL);
          }
=======
>>>>>>> Stashed changes
        }
      } catch (err) {
        console.log("Error in getting video input!");
      }
    };

<<<<<<< Updated upstream
    let timerInterval = setInterval(() => {
      setTimeInSec((prev) => setTimeInSec(prev + 1));
=======
    let timerInterval = setInterval(()=>{
        console.log("yiem", timeInSec);
        
        setTimeInSec((prev)=>setTimeInSec(prev+1));
>>>>>>> Stashed changes
    }, 1000);

    getVideo();

    return () => {
<<<<<<< Updated upstream
      clearInterval(timerInterval);
=======
        clearInterval(timerInterval);
>>>>>>> Stashed changes
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject;
        const tracks = stream.getTracks();

        tracks.forEach((track) => track.stop()); // Stop all tracks in the stream
        videoRef.current.srcObject = null; // Clear the source
      }
    };
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
  }, []);

  return (
    <div className="font-['general']">
      <video
        ref={videoRef}
<<<<<<< Updated upstream
        style={{
          width: windowDimensions.width,
          height: windowDimensions.height,
        }}
=======
        style={{width: windowDimensions.width, height:windowDimensions.height}}
>>>>>>> Stashed changes
        autoPlay
        muted
      ></video>
      {!activityStarted && (
        <span className="fixed inset-0 flex items-center justify-center z-1000">
          <button
            className="bg-[#0056F1] text-white px-3 py-2"
            onClick={startActivity}
          >
            Start
          </button>
        </span>
      )}

      {activityStarted && (
        <div className="fixed inset-0 p-2">
          <div>
            <span className="text-xl block md:text-2xl">Score: {reps}</span>
            <span className="text-lg">High score: 101</span>
          </div>

          <div className="fixed bottom-0 right-0 p-2">
            <span>Current exercise: Squats</span>
          </div>

          <div className="fixed top-0 right-0 p-2 text-5xl">
<<<<<<< Updated upstream
            <time>
              {Math.round(timeInSec / 60 <= 9)
                ? "0" + Math.round(timeInSec / 60)
                : Math.round(timeInSec / 60)}
              :{timeInSec % 60 <= 9 ? "0" + (timeInSec % 60) : timeInSec % 60}
            </time>
          </div>
          <div className="fixed bottom-0 left-0">
            {/* Socket connection: {socketConnected?"Connected":"Not connected"} */}
=======
                <time>{Math.round(timeInSec/60<=9)?"0"+Math.round(timeInSec/60):Math.round(timeInSec/60)}:{timeInSec%60<=9?"0"+timeInSec%60:timeInSec%60}</time>
>>>>>>> Stashed changes
          </div>
        </div>
      )}
    </div>
  );
}
