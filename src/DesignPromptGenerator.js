import React, { useState} from "react";
import {CopyToClipboard} from "react-copy-to-clipboard"
import axios from "axios";
import Logo from './crowwwnLogo.png'
import './DesignPrompt.css'
import Modal from './Modal'
import {Button} from "rsuite";
import "rsuite/dist/rsuite-no-reset.min.css"; 

const API_KEY = process.env.REACT_APP_API_KEY;

const DesignPromptGenerator = () => {
  const ButtonStyle = {backgroundColor: "#3F66EF", margin: "0px 0px 10px 0px" };

  const [prompt, setPrompt] = useState("");
  const [copy, setCopy] = useState("Copy")
  const [copied, setCopied] = useState(false)
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const generatePrompt = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: "You are a UX designer." },
            { role: "user", content: "Generate a design prompt for a new app feature." },
          ],
          max_tokens: 70,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${API_KEY}`,
          },
        }
      );

      const generatedPrompt = response.data.choices[0].message.content.trim();

      if(generatedPrompt.endsWith('.')){
        setPrompt(generatedPrompt)
        setLoading(false);
      } else {
        generatePrompt();
      }

      setCopied(false);
      setCopy('Copy');

      
      
    } catch (error) {
      console.error("Error generating prompt:", error);
    };

  };

  const showAlert = () => {
    if(prompt.length > 1) {
      setCopy('Copied')
      setCopied(true)
      setShow(true)
      setTimeout(() => {
        setShow(false)
      }, 900)
    }
  }

  return (
    <div className="prompt">
        <img className="logo" src={Logo} alt="crowwwnLogo" />
        {prompt.length > 1 ? <h2 className="prompt-text">"{prompt}"</h2> : <h1>Use A.I. to generate prompts for your next UX Design project</h1>}
        <div className="btns">
          {loading ? <Button loading appearance="primary" style={ButtonStyle}className="prompt-btn">Loading...</Button> : <button className="prompt-btn"onClick={generatePrompt}>Generate Prompt</button>}
          <CopyToClipboard text={prompt}>
            <button className="copy-btn" onClick={showAlert}>{copy}</button>
          </CopyToClipboard>
        </div>
        <p>Thank you for supporting Crowwwn</p>
        <div className="modal">
          {copied && show ? <Modal/> : null}
        </div>
    </div>
  );
};

export default DesignPromptGenerator;