import React, { useState } from 'react';
import './App.css';
import Flashcard from './Flashcard';
const cohere = require("cohere-ai");

if (!window.Buffer) {
  let temp = require("buffer")
  window.Buffer = temp.Buffer

}


function App() {
  const [prompt, setPrompt] = useState('');
  const [flashcards, setFlashcards] = useState([]);
  
  const handleGenerate = async () => {
    try {
      cohere.init(process.env.COHERE_API_KEY);
      
      const generateResponse = await cohere.generate({
        model: "large",
        prompt: `Generate 10 educational flashcards with questions and answers based on content solely from the input text. Do not include information not explicitly included in the input. The intended audience is high school students. The flashcards should cover the key concepts and information in the input text in a concise and easy-to-understand manner. Here are two example flashcards: Front: What is the function of the mitochondria? Back: The mitochondria are responsible for producing energy in the cell through cellular respiration. Front: What are the three types of muscle tissue? Back: The three types of muscle tissue are skeletal, smooth, and cardiac. Skeletal muscle is responsible for voluntary movement, smooth muscle is found in organs and blood vessels, and cardiac muscle is found only in the heart. The input text is: ${prompt}.`,
        max_tokens: 50,
        temperature: 1,
      });

      console.log(generateResponse.data.text)
  
      // Assuming response.data contains flashcards
      setFlashcards(generateResponse.data.text);
    } catch (error) {
      console.error("Error generating flashcards:", error);
    }
  };
  

  const handleDownloadCSV = () => {
    const csvContent = flashcards.map(card => `${card.front}, ${card.back}`).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "flashcards.csv");
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div className="App">
      <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} />
      <button onClick={handleGenerate}>Generate Flashcards</button>
      <div>
        {flashcards.map((flashcard, index) => (
        <Flashcard key={index} {...flashcard} />
      ))}
      </div>
      <button onClick={handleDownloadCSV} disabled={flashcards.length === 0}>Download CSV</button>
      {/* Render flashcards here */}
    </div>
  );
}

export default App;