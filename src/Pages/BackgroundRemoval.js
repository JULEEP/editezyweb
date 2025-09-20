import React, { useState, useRef } from 'react';

function BackgroundRemover() {
  const [originalImage, setOriginalImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  // Remove.bg API key - aapko yahan apni API key dalni hogi
  // Sign up karein: https://www.remove.bg/api
  const API_KEY = 'RMUGZeFkS3zCu19YTAZ8XBu3';

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Reset previous state
    setError(null);
    setProcessedImage(null);
    
    // Check file size (Remove.bg free tier has 5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size should be less than 5MB for free API');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setOriginalImage(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  // Remove background using Remove.bg API
  const removeBackground = async () => {
    if (!originalImage) return;
    
    setIsProcessing(true);
    setError(null);
    
    try {
      // Convert data URL to blob
      const response = await fetch(originalImage);
      const blob = await response.blob();
      
      // Create form data for API request
      const formData = new FormData();
      formData.append('image_file', blob);
      
      // API request to Remove.bg
      const apiResponse = await fetch('https://api.remove.bg/v1.0/removebg', {
        method: 'POST',
        headers: {
          'X-Api-Key': API_KEY,
        },
        body: formData,
      });
      
      if (!apiResponse.ok) {
        const errorData = await apiResponse.json();
        throw new Error(errorData.errors ? errorData.errors[0].title : 'Background removal failed');
      }
      
      // Convert response to data URL
      const processedBlob = await apiResponse.blob();
      const reader = new FileReader();
      reader.onload = () => {
        setProcessedImage(reader.result);
        setIsProcessing(false);
      };
      reader.readAsDataURL(processedBlob);
      
    } catch (error) {
      console.error('Error removing background:', error);
      setError(error.message || 'Background removal failed. Please try again.');
      setIsProcessing(false);
    }
  };

  // Download the processed image
  const downloadImage = () => {
    if (!processedImage) return;
    
    const link = document.createElement('a');
    link.href = processedImage;
    link.download = 'background-removed.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Share the processed image
  const shareImage = async () => {
    if (!processedImage) return;
    
    try {
      // Convert data URL to blob
      const response = await fetch(processedImage);
      const blob = await response.blob();
      const file = new File([blob], 'background-removed.png', { type: 'image/png' });
      
      if (navigator.share) {
        await navigator.share({
          title: 'Background Removed Image',
          files: [file]
        });
      } else {
        alert('Web Share API not supported in your browser. You can download the image instead.');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Background Remover</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          {/* Upload Section */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Upload Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              ref={fileInputRef}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <p className="text-xs text-gray-500 mt-1">Maximum file size: 5MB</p>
          </div>
          
          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}
          
          {/* Preview and Processing */}
          {originalImage && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Original Image</h3>
                <img 
                  src={originalImage} 
                  alt="Original" 
                  className="w-full h-64 object-contain border rounded-lg"
                />
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Processed Image</h3>
                {isProcessing ? (
                  <div className="w-full h-64 flex items-center justify-center border rounded-lg bg-gray-100">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                      <p className="mt-2 text-sm text-gray-600">Removing background...</p>
                    </div>
                  </div>
                ) : processedImage ? (
                  <img 
                    src={processedImage} 
                    alt="Processed" 
                    className="w-full h-64 object-contain border rounded-lg bg-gray-100"
                  />
                ) : (
                  <div className="w-full h-64 flex items-center justify-center border rounded-lg bg-gray-100">
                    <p className="text-gray-500">Processed image will appear here</p>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            {originalImage && !processedImage && !isProcessing && (
              <button
                onClick={removeBackground}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Remove Background
              </button>
            )}
            
            {processedImage && (
              <>
                <button
                  onClick={downloadImage}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                >
                  Download Image
                </button>
                
                <button
                  onClick={shareImage}
                  className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors"
                >
                  Share Image
                </button>
              </>
            )}
            
            {(originalImage || processedImage) && (
              <button
                onClick={() => {
                  setOriginalImage(null);
                  setProcessedImage(null);
                  setError(null);
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Reset
              </button>
            )}
          </div>
        </div>
        
        {/* Information Section */}
        <div className="mt-6 bg-blue-50 p-4 rounded-lg">
          <h3 className="font-medium text-blue-800 mb-2">How to use</h3>
          <ol className="list-decimal list-inside text-sm text-blue-700 space-y-2">
            <li>Remove.bg account banayein: <a href="https://www.remove.bg/api" target="_blank" rel="noopener noreferrer" className="underline">https://www.remove.bg/api</a></li>
            <li>Free API key lein (50 free images per month)</li>
            <li>Yahan API_KEY variable mein apni API key dalen</li>
            <li>Image upload karein aur background remove karein</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

export default BackgroundRemover;