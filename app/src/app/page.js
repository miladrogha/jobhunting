"use client";
import Image from "next/image";
import styles from "./page.module.css";
import { useRef, useState } from "react";
import axios from "axios";

export default function Home() {
  const [jobDesc, setJobDesc] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const jobDescription = useRef(null);

  const handleResponse = (response) => {
    const { jobDesc, img_data } = response.data;
    // Set state or otherwise update your UI
    setJobDesc(jobDesc);
    setImageSrc(`data:image/jpeg;base64,${img_data}`);
  };

  function handleSubmit(e) {
    e.preventDefault();

    axios
      .post("/api/process", { data: jobDescription.current.value })
      .then((resp) => {
        console.log(resp.data.jobDesc);
        handleResponse(resp);
      })

      .catch((e) => {
        console.log(e);
      });
  }

  function handleClear() {
    setJobDesc((prev) => null);
  }

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>JOB HUNTING COMPANION</h1>
        <ol>
          <li>Copy and paste Job description below.</li>
          <li>
            Click on the <code>process</code> button.
          </li>
        </ol>
        <section className={styles.formContainer}>
          <form>
            <label htmlFor="jobDesc">
              Copy and paste the job description in the field below
            </label>
            <textarea
              id="jobDesc"
              type="text"
              ref={jobDescription}
              placeholder="job description here..."
              size={120}
              spellCheck={true}
              rows={10}
              wrap="soft"
              required
            />
            <span className="validity"></span>
          </form>
          <div className={styles.ctas}>
            <button
              type="button"
              onClick={handleSubmit}
              className={styles.primary}
            >
              Process
            </button>
            <button
              type="button"
              onClick={handleClear}
              className={styles.primary}
            >
              Clear
            </button>
          </div>
        </section>

        <section className={styles.analysisContainer}>
          <p className={styles.descText}>{jobDesc}</p>
          {imageSrc ? (
            <Image
              className={styles.analysisImg}
              src={imageSrc}
              alt="Word Cloud"
              width={800}
              height={400}
            />
          ) : (
            ""
          )}
        </section>
      </main>
      <footer className={styles.footer}>
        <a
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
