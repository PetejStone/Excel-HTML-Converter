import React, { useState } from 'react';
import './App.css';

function App() {
  const [htmlOutput, setHtmlOutput] = useState('Converted HTML will appear here...');
  const [renderedHTML, setRenderedHTML] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState('');

  const handleFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    // Strip .xlsx extension
    const originalName = file.name;
    const cleanName = originalName.endsWith('.xlsx') ? originalName.slice(0, -5) : originalName;
    setFileName(cleanName);

    try {
      const response = await fetch("https://xpx-backend.onrender.com/upload", {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      if (result.html) {
        setHtmlOutput(result.html);
        setRenderedHTML(result.html);
      } else {
        setHtmlOutput(result.error || 'Unknown error');
      }
    } catch (error) {
      setHtmlOutput('Error uploading file');
    }
  };

  const onDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    const file = event.dataTransfer.files[0];
    if (file && file.name.endsWith('.xlsx')) {
      handleFile(file);
    }
  };

  const onDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const onDragEnter = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  };

  const onDragLeave = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  };

  const onFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.name.endsWith('.xlsx')) {
      handleFile(file);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(renderedHTML)
      .then(() => alert('HTML copied to clipboard!'))
      .catch(() => alert('Failed to copy HTML.'));
  };

  return (
    <div className="App">
      <h1>XLSX to HTML Table Converter</h1>

      <div
        className={`upload-area ${isDragging ? 'dragging' : ''}`}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onClick={() => document.getElementById('fileInput').click()}
      >
        <p>Drag & drop your .xlsx file here, or click to select</p>
        <input
          type="file"
          id="fileInput"
          accept=".xlsx"
          onChange={onFileChange}
          style={{ display: 'none' }}
        />
      </div>

      <div className="rendered-output" dangerouslySetInnerHTML={{ __html: renderedHTML }} />

      {renderedHTML && (
        <>
          <button className="convert-button" onClick={handleCopy}>Copy HTML</button>
          <pre className="code-output">{htmlOutput}</pre>
        </>
      )}
    </div>
  );
}

export default App;
