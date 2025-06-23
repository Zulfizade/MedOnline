import React from "react";
import styles from "./Loader.module.css";

const Loader = () => (
  <div className={styles.loaderContainer}>
    <svg className={styles.kardiogram} viewBox="0 0 120 40">
      <polyline
        fill="none"
        stroke="#1a8f3c"
        strokeWidth="3"
        points="0,20 10,20 15,35 25,5 35,35 45,20 60,20 65,30 75,10 85,30 95,20 120,20"
      >
        <animate
          attributeName="stroke-dashoffset"
          values="120;0"
          dur="1.2s"
          repeatCount="indefinite"
        />
      </polyline>
    </svg>
    <div className={styles.heart}></div>
  </div>
);

export default Loader;