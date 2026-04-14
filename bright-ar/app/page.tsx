"use client";
import Webcam from "react-webcam";
import styles from "./page.module.css";

export default function Cam() {
  return (
    <div className={styles.container}>
      <Webcam mirrored={true} className={styles.webcam}/>
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