import React, {useState} from "react";
import './App.css';

function App() {
  const [input, setInput] = useState("");
  const [infoText, setInfoText] = useState("Type a word in Finnish and press Enter");
  const [result, setResult] = useState(null);
  const [audioUrl, setAudioUrl] = useState("");

  const translateWord = async(word) => {
    try{
      const res = await fetch("https://libretranslate.com/translate",{
        method: "POST",
        body: JSON.stringify({
          q: word,
          source: "fi",
          target: "en",
          format: "text",
        }),
        headers: {"Content-Type": "application/json"},
      });

      const data = await res.json();
      return data.translatedText;
    } 
    catch(err){
      console.error("Translated error:", err);
      setInfoText("Translation error. Try again.");
      return null;
    }
  };

  const fetchDefinition = async(word) => {
    try {
      setInfoText(`Searching for the meaning of "${input}"...`);
      setResult(null);
      setAudioUrl("");

      const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
      const data = await res.json();

      if (data.title){
        setInfoText("No meaning found.");
        setResult({word, meaning: "N/A", audio: "None"});
        return;
      }

      const firstMeaning = data[0].meanings[0].definitions[0].definition;
      const audio = data[0].phonetics.find(p => p.audio)?.audio;

      setResult({
        word: data[0].word,
        meaning: firstMeaning,
      });

      if (audio){
        setAudioUrl(audio);
      }
      setInfoText("");
    }
    catch(err){
      console.error("Definition fetch error:", err);
      setInfoText("Error fetching definition.");
    }
  };

  const handleKeyUp = async (e) => {
    if (e.key === "Enter" && input.trim()){
      setInfoText(`Translating "${input}"...`);
      const translated = await translateWord(input);

      if (translated) {
        await fetchDefinition(translated);
      }
    }
    
  };

  return(
    <div className="container">
      <h1 className = "heading">Finnish Dictionary</h1>
      <input placeholder="Enter a word" type="text" className="input" value={input} onChange={(e) => setInput(e.target.value)} onKeyUp={handleKeyUp}/>
      <p className="info-text">{infoText}</p>
      {result && 
        (<div className="meaning-container">
         <p> Word Title: <span className="title">{result.word}</span></p>
         <p>Meaning: <span className="meaning">{result.meaning}</span></p>
         {audioUrl && <audio controls src={audioUrl}></audio>}
      </div>)}
    </div>
  );
}

export default App;
