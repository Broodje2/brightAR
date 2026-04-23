"use client";
import Webcam from "react-webcam";
import styles from "./page.module.css";
import { useEffect, useRef, useState } from "react";

export default function Cam() {
  const [beerCounter, setBeerCounter] = useState(0);

  const webcamRef = useRef<Webcam | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const buffer = useRef<ImageData[]>([]);

  const delayRef = useRef<number>(0);
  const FPS = 30;

  const getDelay = (beerCounter: number) => {
    return 600 / (1 + Math.exp(-0.9 * (beerCounter - 6)));
  };

  useEffect(() => {
    delayRef.current = getDelay(beerCounter);

    const maxFrames = Math.round((delayRef.current / 1000) * FPS);

    if (buffer.current.length > maxFrames) {
      buffer.current = buffer.current.slice(-maxFrames);
    }
  }, [beerCounter]);

  useEffect(() => {
    const interval = setInterval(() => {
      const webcam = webcamRef.current;
      const canvas = canvasRef.current;
      if (!webcam || !canvas) return;

      const ctx = canvas.getContext("2d");
      const video = webcam.video;
      if (!video || !ctx) return;

      if (video.readyState === 4) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0);
        const frame = (ctx.getImageData(0, 0, canvas.width, canvas.height));
        buffer.current.push(frame);

        const maxFrames = Math.round((delayRef.current / 1000) * FPS);

        if (buffer.current.length > maxFrames) {
          const delayedFrame = buffer.current.shift();
          if (delayedFrame) {
            ctx.putImageData(delayedFrame, 0, 0);
          }
        }
      }
  }, 1000 / FPS);

    return () => clearInterval(interval);
  }, []);

  const handleKeyPress = (event: KeyboardEvent) => {
    if (event.key === "+" || event.key === "=") {
      setBeerCounter((prev) => prev + 1);
    } else if (event.key === "-" || event.key === "_") {
      setBeerCounter((prev) => prev - 1);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.beer_counter}>Beer Counter: {beerCounter}</div>
      <Webcam ref={webcamRef} className={styles.webcam}/>
      <canvas ref={canvasRef} className={styles.canvas}></canvas>
      <div className={styles.color_overlay}></div>
      <div className={styles.blur_filter}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
}