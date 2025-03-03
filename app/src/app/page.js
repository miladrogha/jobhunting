"use client";
import Image from "next/image";
import styles from "./page.module.css";
import { Fragment, useEffect, useRef, useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import sendIcon from "../../public/send.png";
import alphaBW from "../../public/Alpha_bw.svg";
import alphaLogo from "../../public/Alpha.svg";
import loadingLogo from "../../public/loading.gif";
import Nav from "./components/Nav";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [jobDesc, setJobDesc] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [frequencies, setFrequencies] = useState(null);
  const [techReq, setTechReq] = useState(null);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi there! I am Alpha! Here to help! Ask me anything...",
    },
  ]);
  const [userInput, setUserInput] = useState("");
  const jobDescription = useRef(null);

  const handleResponse = (response) => {
    const { img_data, word_freq, technical_req } = response.data;
    // Set state or otherwise update your UI
    setImageSrc(`data:image/jpeg;base64,${img_data}`);
    setFrequencies(word_freq);
    setTechReq(technical_req);
  };

  function handleAlphaResponse(response) {
    const resp_array = response.data;
    let done = false;
    let accumulatedText = "";

    resp_array.map((resp, i) => {
      accumulatedText += resp.message.content;
    });

    return accumulatedText;
  }

  function separateReasoningAndResponse(input) {
    // The regex captures two groups:
    // Group 1: Text between <think> and </think>
    // Group 2: The remaining text after </think>
    const regex = /<think>([\s\S]*?)<\/think>\s*([\s\S]*)/;
    const match = input.match(regex);
    if (match) {
      return {
        reasoning: match[1].trim(),
        response: match[2].trim(),
      };
    }
    // Fallback: if no <think> tags are found, return the entire string as response.
    return { reasoning: "", response: input.trim() };
  }

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setJobDesc(jobDescription.current.value);
    axios
      .post("/api/process", { data: jobDescription.current.value })
      .then((resp) => {
        handleResponse(resp);
      })

      .catch((e) => {
        console.log(e);
      });

    const newMsg = {
      role: "user",
      content: `Hi. Based on the job description below, help me with any question I may have. :\n job description: ${jobDescription.current.value}`,
    };

    axios
      .post("/api/ask-alpha", {
        data: newMsg,
      })
      .then((resp) => handleAlphaResponse(resp))
      .then((res) => {
        const { reasoning, response } = separateReasoningAndResponse(res);
        const new_assist_msg = { role: "assistant", content: response };
        setMessages((prev) => [...prev, new_assist_msg]);
        setLoading(false);
      });
  }

  function handleClear() {
    setJobDesc((prev) => null);
  }

  function handleSendMessage(e) {
    e.preventDefault();
    setLoading(true);
    const newMsg = { role: "user", content: userInput };
    setMessages((prev) => [...prev, newMsg]);
    setUserInput(""); //clear message text area
    axios
      .post("/api/ask-alpha", {
        data: newMsg,
      })
      .then((resp) => handleAlphaResponse(resp))
      .then((res) => {
        const { reasoning, response } = separateReasoningAndResponse(res);
        const new_assist_msg = { role: "assistant", content: response };
        setMessages((prev) => [...prev, new_assist_msg]);
        setLoading(false);
      });
  }

  return (
    <div className={styles.page}>
      <Nav />
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
            <div className={styles.actions}>
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
        </div>
        <div className={styles.chatContainer}>
          <h2>Chat with Alpha</h2>
          {jobDesc ? (
            <Fragment>
              <div className={styles.conversationContainer}>
                {messages?.map((msg, i) => (
                  <div
                    className={styles[msg.role]}
                    key={`${i}_th_msg`}
                  >
                    {msg.role === "assistant" ? (
                      <Image
                        src={alphaLogo}
                        width={30}
                        height={30}
                        alt="alpha small logo"
                      />
                    ) : (
                      ""
                    )}
                    <ReactMarkdown className={styles.alphaResponse}>
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                ))}
              </div>
              <div className={styles.userInput}>
                <form className={styles.messageContainer}>
                  <label htmlFor="alphaUserMessage"></label>
                  <textarea
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    id="alphaUserMessage"
                    placeholder="What do you want to ask from Alpha...?"
                    className={styles.chatInput}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSendMessage(e);
                      }
                    }}
                  />
                </form>

                <div className={styles.actions}>
                  <button
                    className={styles.sendButton}
                    type="button"
                    onClick={handleSendMessage}
                  >
                    <Image
                      className={styles.sendMessageImg}
                      src={sendIcon}
                      alt="send message"
                      width={40}
                      height={40}
                    />
                  </button>
                </div>
                {loading ? (
                  <div className={styles.thinking}>
                    <Image
                      className={styles.sendMessageImg}
                      src={loadingLogo}
                      alt="Loading results"
                      width={40}
                      height={40}
                      priority
                    />
                    <p className={styles.appMessage}>Thinking...</p>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </Fragment>
          ) : (
            <Fragment>
              <Image
                src={alphaBW}
                width={200}
                height={200}
                alt={"alpha logo disabled"}
                priority
              />
              <p className={styles.appMessage}>
                Copy and paste the job description you want information about
                first!
              </p>
            </Fragment>
          )}
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

              <div className={styles.keywordsContainer}>
                <h3>Top 10 keywords</h3>
                <ol>
                  {frequencies.map((d, i) => (
                    <li key={`${i}th_keyword`}>{d[0]}</li>
                  ))}
                </ol>
              </div>
              <div className={styles.modelanalysis}>
                <h3>Top 10 Technical Requirements For This Job</h3>
                <div className={styles.alphaResponseContainer}>
                  <span>
                    {" "}
                    <Image
                      className={styles.analysisImg}
                      src={alphaLogo}
                      alt="Alpha logo"
                      width={50}
                      height={50}
                    />
                    <ReactMarkdown className={styles.alphaResponse}>
                      {techReq.response}
                    </ReactMarkdown>
                  </span>
                </div>

                <p className={styles.alphaReason}>{techReq.reason}</p>
              </div>
            </Fragment>
          ) : (
            <p className={styles.appMessage}>No data to analyze</p>
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
