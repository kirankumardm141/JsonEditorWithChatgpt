import React, { useState } from 'react';
import ReactJson from 'react-json-view';
import axios from 'axios';

const JsonEditor = () => {
  const [json, setJson] = useState({});
  const [code, setCode] = useState('');
  const [response, setResponse] = useState('');
  const [jsonInput, setJsonInput] = useState('');
  const [isLoading, setIsLoading] = useState(false); // New loading state

  // Handle changes in the JSON editor
  const handleJsonChange = (newJson) => {
    setJson(newJson.updated_src);
    setCode(JSON.stringify(newJson.updated_src, null, 2));
  };

  // Handle changes in the textarea input
  const handleTextareaChange = (e) => {
    const value = e.target.value;
    setJsonInput(value);

    try {
      const parsedJson = JSON.parse(value);
      setJson(parsedJson);  // Update JSON preview if valid
      setCode(value); // Update the code for sending to backend
      setResponse(''); // Clear previous response
    } catch (error) {
      setJson({});  // Clear JSON if parsing fails
      setResponse('Invalid JSON input');
    }
  };

  // Handle sending the code to the backend (ChatGPT)
  const getSuggestions = async () => {
    if (!code) {
      setResponse('No JSON to analyze');
      return;
    }

    setIsLoading(true); // Start loading state

    try {
      const res = await axios.post('http://localhost:8080/api/chatgpt/suggestions', { code }, {
        headers: { 'Content-Type': 'application/json' },
      });
      
      setResponse(res.data);
    } catch (error) {
      console.error('Error:', error);
      setResponse('Error communicating with the backend');
    } finally {
      setIsLoading(false); // End loading state
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>JSON Editor with ChatGPT Suggestions</h1>

      {/* Textarea for JSON input */}
      <div>
        <h2>Enter JSON Below</h2>
        <textarea
          value={jsonInput}
          onChange={handleTextareaChange}
          rows={10}
          cols={50}
          placeholder="Enter your JSON here..."
          style={{ width: '100%', padding: '10px', fontFamily: 'monospace' }}
        />
      </div>

      {/* Display JSON preview with react-json-view */}
      <div style={{ marginTop: '20px' }}>
        <h2>JSON Preview</h2>
        <ReactJson
          src={json}
          onEdit={handleJsonChange}
          onAdd={handleJsonChange}
          onDelete={handleJsonChange}
          collapsed={false}
        />
      </div>

      {/* Button to get ChatGPT suggestions */}
      <div style={{ marginTop: '20px' }}>
        <button 
          onClick={getSuggestions} 
          style={{ padding: '10px 20px', fontSize: '16px' }}
          disabled={isLoading} // Disable button when loading
        >
          {isLoading ? 'Loading...' : 'Get Code Suggestions from ChatGPT'}
        </button>
      </div>

      {/* Display ChatGPT Response */}
      <div style={{ marginTop: '20px' }}>
        <h2>ChatGPT Response</h2>
        <pre>{response}</pre>
      </div>
    </div>
  );
};

export default JsonEditor;
