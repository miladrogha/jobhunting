"use client";
import React from "react";
import { useRouter } from "next/navigation";
import styles from "./Nav.module.css";
import { GiMouthWatering } from "react-icons/gi";

export default function Nav() {
  const router = useRouter();

  const handleNavigation = () => {
    router.push("/easyApply");
  };

  return (
    <div className={styles.navbar}>
      <div
        className={styles.navButton}
        onClick={handleNavigation}
      >
        <GiMouthWatering
          style={{
            aspectRatio: 1,
            width: 30,
            height: 30,
            marginRight: "1em",
            borderRadius: "50%",
            padding: 4,
          }}
        />{" "}
        Easy Apply
      </div>
    </div>
  );
}
