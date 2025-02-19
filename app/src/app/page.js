"use client";
import Image from "next/image";
import styles from "./page.module.css";
import { Fragment, useRef, useState } from "react";
import axios from "axios";
import alphaLogo from "../../public/android-chrome-512x512.png";
export default function Home() {
  const [jobDesc, setJobDesc] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [frequencies, setFrequencies] = useState(null);
  const [techReq, setTechReq] = useState(null);

  const jobDescription = useRef(null);

  const handleResponse = (response) => {
    const { jobDesc, img_data, word_freq, technical_req } = response.data;

    console.log(response.data["freq"]);
    // Set state or otherwise update your UI
    setJobDesc(jobDesc);
    setImageSrc(`data:image/jpeg;base64,${img_data}`);
    setFrequencies(word_freq);
    setTechReq(technical_req);
  };
  function handleSubmit(e) {
    e.preventDefault();

    axios
      .post("/api/process", { data: jobDescription.current.value })
      .then((resp) => {
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
      <h1>JOB HUNTING COMPANION</h1>
      <main className={styles.main}>
        <div className={styles.mainInfo}>
          <h2>Instructions</h2>
          <ol>
            <li>Copy and paste Job description below.</li>
            <li>
              Click on the <code>process</code> button.
            </li>
          </ol>
        </div>
        <div className={styles.mainInput}>
          <h2>Job Position Information</h2>
          <form className={styles.formContainer}>
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
              className={styles.secondary}
            >
              Clear
            </button>
          </div>

          <div>{/* <p className={styles.descText}>{jobDesc}</p> */}</div>
        </div>
        <div className={styles.mainAnalysis}>
          <h2>Analysis</h2>
          {jobDesc && imageSrc && frequencies ? (
            <Fragment>
              <h3>Wordcloud by frequency</h3>

              <Image
                className={styles.analysisImg}
                src={imageSrc}
                alt="Word Cloud"
                width={800}
                height={400}
              />

              <div className="keywordsContainer">
                <h3>Top 10 keywords</h3>
                <ol>
                  {frequencies.map((d, i) => (
                    <li key={`${i}th_keyword`}>{d[0]}</li>
                  ))}
                </ol>
              </div>
              <div className="modelanalysis">
                <h3>Top 10 Technical Requirements For This Job</h3>
                <div className={styles.alphaResponseCOntainer}>
                  <span>
                    {" "}
                    <Image
                      className={styles.analysisImg}
                      src={alphaLogo}
                      alt="Alpha logo"
                      width={100}
                      height={100}
                    />
                    <p>
                      {" "}
                      <strong>ALPHA:</strong>
                      {techReq.response}
                    </p>
                  </span>
                </div>

                <p className={styles.alphaReason}>{techReq.reason}</p>
              </div>
            </Fragment>
          ) : (
            <p style={{ color: "gray" }}>No data to analyze</p>
          )}
        </div>
      </main>

      <footer className={styles.footer}>
        {" "}
        Designed by Milad Rogha | Copyright 2025{" "}
        <a href="https://studiorogha.com">StudioRogha</a>
      </footer>
    </div>
  );
}
