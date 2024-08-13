import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../App.css'; // Create a separate CSS file for styles

function Home() {
    const [image, setImage] = useState(null);
  const [sketch, setSketch] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(URL.createObjectURL(file));
    setSelectedFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedFile) {
      console.error('No file selected');
      return;
    }

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await fetch('/upload', {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const blob = await response.blob();
      setSketch(URL.createObjectURL(blob));
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
    return (
    <div className="home">
      <nav className="navbar">
        <div className="navbar-brand">Image to Sketch</div>
        <ul className="navbar-nav">
          <li className="nav-item"><Link to="/">Home</Link></li>
       
        </ul>
      </nav>
      
      <header className="home-header">
        <h1>Turn Your Photos into Art!</h1>
        <p>Easily convert your images into beautiful pencil sketches.</p>
        
      </header>
      <h2>Convert Your Image to a Pencil Sketch</h2>
      <button type="submit" className="convert-button" onClick={handleSubmit}>
          Convert to Sketch
        </button>
      
      <form className="convert-form">
      
       
        <div className="image-box">
          <h3>Original Image</h3>
          {image && <img src={image} alt="Original" className="preview-image" />}
          <label htmlFor="file-upload" className="custom-file-upload">
            Choose File
          </label>
          <input 
            id="file-upload" 
            type="file" 
            onChange={handleImageChange} 
            style={{ display: 'none' }} 
          />
        </div>
        <div className="image-box">
        <h3>Pencil Sketch</h3>
          {sketch && (
            <>
              <img src={sketch} alt="Pencil Sketch" className="preview-image" />
              <a href={sketch} download="sketch.png">
                <button type="button" className="convert-button">Download Sketch</button>
              </a>
            </>
          )}
        </div>
        
      </form>
      
    </div>
  );
}

export default Home;
