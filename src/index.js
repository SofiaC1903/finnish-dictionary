import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>

);

// Index JavaScript code based on code in repository: https://github.com/sahandghavidel/HTML-CSS-JavaScript-projects-for-beginners/blob/main/projects/english-dictionary/index.js
const inputEl = document.getElementById("input");
const infoTextEl = document.getElementById("info-text");
const meaningContainerEl = document.getElementById("meaning-container");
const meaningEl = document.getElementById("meaning");
const audioEl = document.getElementById("audio");

// Implementing libretranslate API(https://github.com/LibreTranslate/LibreTranslate) to turn Finnish word into English
const res = await fetch("https://libretranslate.com/translate", {
  method: "POST",
  body: JSON.stringify({
    q: inputEl,
    source: "fi",
    target: "en",
  }),
  headers: { "Content-Type": "application/json" },
});

async function fetchAPI(res){
  try{
    infoTextEl.style.display = "block";
    meaningContainerEl.style.display = "none";
    infoTextEl.innerText = 'Searching the meaning of "${inputEl}"';
    const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${res}`;
    const result = await fetch(url).then((res) => res.json());

    if (result.title){
      meaningContainerEl.style.display = "block";
      infoTextEl.style.display = "none";
      titleEl.innerText = inputEl;
      meaningEl.innerText = "N/A";
      audioEl.style.display = "none";
    }
    else{
      meaningContainerEl.style.display = "block";
      infoTextEl.style.display = "none";
      audioEl.style.display = "inline-flex";
      titleEl.innerText = result[0].word;
      meaningEl.innerText = result[0].meanings[0].definitions[0].definition;
      audioEl.src = result[0].phonetics[0].audio;
    }
  }
  catch(error){
    console.log(error);
    infoTextEl.innerText = 'an error happened, try again later';
  }
}

inputEl.addEventListener("keyup", (e) => {
  if(e.target.value && e.key == "Enter"){
    fetchAPI(e.target.value);
  }
});

console.log(await res.json());
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
