import React, { useRef, useState, useEffect } from "react";

const PRESET_SIZES = [
  { w: 2400, h: 2400, label: "2400×2400" },
  { w: 750, h: 1334, label: "750×1334" },
  { w: 812, h: 312, label: "812×312" },
  { w: 1200, h: 1200, label: "1200×1200" },
  { w: 1080, h: 1350, label: "1080×1350" },
  { w: 1280, h: 720, label: "1280×720" },
  { w: 2480, h: 3507, label: "2480×3507" },
  { w: 850, h: 1100, label: "850×1100" },
];

const FONT_OPTIONS = [
  "Arial",
  "Verdana",
  "Helvetica",
  "Times New Roman",
  "Courier New",
  "Georgia",
  "Palatino",
  "Garamond",
  "Comic Sans MS",
  "Impact",
  "Lucida Sans Unicode",
  "Tahoma",
  "Trebuchet MS",
];

const LOGO_SHAPES = [
  { value: "rectangle", label: "Rectangle" },
  { value: "circle", label: "Circle" },
  { value: "rounded", label: "Rounded" },
  { value: "triangle", label: "Triangle" },
];

function CustomPosterEditor() {
  const canvasRef = useRef(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [showEditor, setShowEditor] = useState(false);
  const [bgColor, setBgColor] = useState("#ffffff");
  const [objects, setObjects] = useState([]); // texts + logos
  const [backgroundImg, setBackgroundImg] = useState(null);
  const [activeIndex, setActiveIndex] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [textInput, setTextInput] = useState(""); // For editing text
  const [logoShape, setLogoShape] = useState("rectangle");
  const [showDownloadOptions, setShowDownloadOptions] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);

  useEffect(() => {
    if (!selectedSize) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = selectedSize.w;
    canvas.height = selectedSize.h;

    // background fill
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // background poster image
    if (backgroundImg) {
      const { iw, ih, img } = backgroundImg;
      const { w: cw, h: ch } = selectedSize;
      const scale = Math.min(cw / iw, ch / ih);
      const nw = iw * scale;
      const nh = ih * scale;
      const x = (cw - nw) / 2;
      const y = (ch - nh) / 2;
      ctx.drawImage(img, x, y, nw, nh);
    }

    // draw other objects
    objects.forEach((obj, i) => {
      if (obj.type === "text") {
        ctx.font = `${obj.bold ? "bold" : ""} ${obj.italic ? "italic" : ""} ${obj.size}px ${obj.font}`;
        ctx.fillStyle = obj.color;
        ctx.fillText(obj.text, obj.x, obj.y);
        if (i === activeIndex) {
          const width = ctx.measureText(obj.text).width;
          ctx.strokeStyle = "red";
          ctx.strokeRect(obj.x, obj.y - obj.size, width, obj.size);
        }
      }
      if (obj.type === "image" && obj.img) {
        // Save current context
        ctx.save();
        
        // Apply shape transformations
        if (obj.shape === "circle") {
          ctx.beginPath();
          ctx.arc(obj.x + obj.width/2, obj.y + obj.height/2, obj.width/2, 0, Math.PI * 2);
          ctx.closePath();
          ctx.clip();
        } else if (obj.shape === "rounded") {
          const radius = 20;
          ctx.beginPath();
          ctx.moveTo(obj.x + radius, obj.y);
          ctx.lineTo(obj.x + obj.width - radius, obj.y);
          ctx.quadraticCurveTo(obj.x + obj.width, obj.y, obj.x + obj.width, obj.y + radius);
          ctx.lineTo(obj.x + obj.width, obj.y + obj.height - radius);
          ctx.quadraticCurveTo(obj.x + obj.width, obj.y + obj.height, obj.x + obj.width - radius, obj.y + obj.height);
          ctx.lineTo(obj.x + radius, obj.y + obj.height);
          ctx.quadraticCurveTo(obj.x, obj.y + obj.height, obj.x, obj.y + obj.height - radius);
          ctx.lineTo(obj.x, obj.y + radius);
          ctx.quadraticCurveTo(obj.x, obj.y, obj.x + radius, obj.y);
          ctx.closePath();
          ctx.clip();
        } else if (obj.shape === "triangle") {
          ctx.beginPath();
          ctx.moveTo(obj.x + obj.width/2, obj.y);
          ctx.lineTo(obj.x + obj.width, obj.y + obj.height);
          ctx.lineTo(obj.x, obj.y + obj.height);
          ctx.closePath();
          ctx.clip();
        }
        
        ctx.drawImage(obj.img, obj.x, obj.y, obj.width, obj.height);
        
        // Restore context for the selection border
        ctx.restore();
        
        if (i === activeIndex) {
          ctx.strokeStyle = "blue";
          if (obj.shape === "circle") {
            ctx.beginPath();
            ctx.arc(obj.x + obj.width/2, obj.y + obj.height/2, obj.width/2, 0, Math.PI * 2);
            ctx.stroke();
          } else if (obj.shape === "rounded") {
            const radius = 20;
            ctx.beginPath();
            ctx.moveTo(obj.x + radius, obj.y);
            ctx.lineTo(obj.x + obj.width - radius, obj.y);
            ctx.quadraticCurveTo(obj.x + obj.width, obj.y, obj.x + obj.width, obj.y + radius);
            ctx.lineTo(obj.x + obj.width, obj.y + obj.height - radius);
            ctx.quadraticCurveTo(obj.x + obj.width, obj.y + obj.height, obj.x + obj.width - radius, obj.y + obj.height);
            ctx.lineTo(obj.x + radius, obj.y + obj.height);
            ctx.quadraticCurveTo(obj.x, obj.y + obj.height, obj.x, obj.y + obj.height - radius);
            ctx.lineTo(obj.x, obj.y + radius);
            ctx.quadraticCurveTo(obj.x, obj.y, obj.x + radius, obj.y);
            ctx.closePath();
            ctx.stroke();
          } else if (obj.shape === "triangle") {
            ctx.beginPath();
            ctx.moveTo(obj.x + obj.width/2, obj.y);
            ctx.lineTo(obj.x + obj.width, obj.y + obj.height);
            ctx.lineTo(obj.x, obj.y + obj.height);
            ctx.closePath();
            ctx.stroke();
          } else {
            ctx.strokeRect(obj.x, obj.y, obj.width, obj.height);
          }
        }
      }
    });
  }, [selectedSize, bgColor, objects, backgroundImg, activeIndex]);

  // Update text input when active object changes
  useEffect(() => {
    if (activeIndex !== null && objects[activeIndex] && objects[activeIndex].type === "text") {
      setTextInput(objects[activeIndex].text);
    } else {
      setTextInput("");
    }
  }, [activeIndex, objects]);

  // Dragging
  const handleMouseDown = (e) => {
    if (!selectedSize) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const scale = Math.min(600, selectedSize.w / 2) / selectedSize.w;
    const x = (e.clientX - rect.left) / scale;
    const y = (e.clientY - rect.top) / scale;

    for (let i = objects.length - 1; i >= 0; i--) {
      const obj = objects[i];
      if (obj.type === "text") {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        ctx.font = `${obj.bold ? "bold" : ""} ${obj.italic ? "italic" : ""} ${obj.size}px ${obj.font}`;
        const width = ctx.measureText(obj.text).width;
        const height = obj.size;
        if (x >= obj.x && x <= obj.x + width && y <= obj.y && y >= obj.y - height) {
          setActiveIndex(i);
          setDragging(true);
          setOffset({ x: x - obj.x, y: y - obj.y });
          return;
        }
      }
      if (obj.type === "image") {
        let isInside = false;
        
        if (obj.shape === "circle") {
          const centerX = obj.x + obj.width/2;
          const centerY = obj.y + obj.height/2;
          const radius = obj.width/2;
          isInside = Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2) <= Math.pow(radius, 2);
        } else if (obj.shape === "rounded") {
          isInside = x >= obj.x && x <= obj.x + obj.width && y >= obj.y && y <= obj.y + obj.height;
        } else if (obj.shape === "triangle") {
          // Simple triangle hit detection
          const barycentric = (x1, y1, x2, y2, x3, y3, x, y) => {
            const denominator = ((y2 - y3)*(x1 - x3) + (x3 - x2)*(y1 - y3));
            const a = ((y2 - y3)*(x - x3) + (x3 - x2)*(y - y3)) / denominator;
            const b = ((y3 - y1)*(x - x3) + (x1 - x3)*(y - y3)) / denominator;
            const c = 1 - a - b;
            return { a, b, c };
          };
          
          const { a, b, c } = barycentric(
            obj.x + obj.width/2, obj.y,
            obj.x + obj.width, obj.y + obj.height,
            obj.x, obj.y + obj.height,
            x, y
          );
          
          isInside = a >= 0 && a <= 1 && b >= 0 && b <= 1 && c >= 0 && c <= 1;
        } else {
          isInside = x >= obj.x && x <= obj.x + obj.width && y >= obj.y && y <= obj.y + obj.height;
        }
        
        if (isInside) {
          setActiveIndex(i);
          setDragging(true);
          setOffset({ x: x - obj.x, y: y - obj.y });
          return;
        }
      }
    }
    // Clicked on empty space - deselect
    setActiveIndex(null);
  };

  const handleMouseMove = (e) => {
    if (!dragging || activeIndex === null) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const scale = Math.min(600, selectedSize.w / 2) / selectedSize.w;
    const x = (e.clientX - rect.left) / scale;
    const y = (e.clientY - rect.top) / scale;

    setObjects((prev) =>
      prev.map((obj, i) =>
        i === activeIndex ? { ...obj, x: x - offset.x, y: y - offset.y } : obj
      )
    );
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  // Add Text
  const handleAddText = () => {
    const newTextObj = {
      type: "text",
      text: "New Text",
      x: 100,
      y: 100,
      size: 40,
      color: "black",
      font: "Arial",
      bold: false,
      italic: false,
    };
    
    setObjects((prev) => [...prev, newTextObj]);
    setActiveIndex(objects.length); // Select the new text object
  };

  // Add Logo
  const handleAddLogo = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const img = new Image();
    img.onload = () => {
      const newImageObj = { 
        type: "image", 
        img, 
        x: 150, 
        y: 150, 
        width: 200, 
        height: 200,
        shape: logoShape
      };
      
      setObjects((prev) => [...prev, newImageObj]);
      setActiveIndex(objects.length); // Select the new image object
    };
    img.src = URL.createObjectURL(file);
  };

  // Upload Poster (background image)
  const handleUploadPoster = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const img = new Image();
    img.onload = () => {
      setBackgroundImg({ img, iw: img.width, ih: img.height });
    };
    img.src = URL.createObjectURL(file);
  };

  // Update active object props
  const updateActiveObject = (changes) => {
    if (activeIndex === null) return;
    setObjects((prev) =>
      prev.map((obj, i) => (i === activeIndex ? { ...obj, ...changes } : obj))
    );
  };

  // Handle text edit (editable field)
  const handleTextChange = (e) => {
    const updatedText = e.target.value;
    setTextInput(updatedText);
    updateActiveObject({ text: updatedText });
  };

  // Handle size selection
  const handleSizeSelect = (s) => {
    setSelectedSize(s);
    setShowEditor(true);
  };

  // Download poster
  const handleDownload = (format = 'png') => {
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    
    if (format === 'png') {
      link.href = canvas.toDataURL('image/png');
      link.download = 'poster.png';
    } else if (format === 'jpeg') {
      link.href = canvas.toDataURL('image/jpeg', 0.9);
      link.download = 'poster.jpg';
    }
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setShowDownloadOptions(false);
  };

  // Share poster
  const handleShare = async (platform) => {
    try {
      const canvas = canvasRef.current;
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      
      // Convert data URL to blob
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      const file = new File([blob], 'poster.jpg', { type: 'image/jpeg' });
      
      if (navigator.share && platform === 'native') {
        await navigator.share({
          title: 'My Poster Design',
          files: [file]
        });
      } else {
        // For social media sharing, we'd typically need a server to host the image
        // This is a simplified implementation
        let shareUrl = '';
        
        switch(platform) {
          case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`;
            break;
          case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent('Check out my poster design!')}&url=${encodeURIComponent(window.location.href)}`;
            break;
          case 'pinterest':
            shareUrl = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(window.location.href)}&media=${encodeURIComponent(dataUrl)}&description=${encodeURIComponent('My poster design')}`;
            break;
          default:
            return;
        }
        
        window.open(shareUrl, '_blank');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
    
    setShowShareOptions(false);
  };

  return (
    <div className="min-h-screen bg-pink-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center mb-4">
          {showEditor && (
            <button
              onClick={() => {
                setShowEditor(false);
                setSelectedSize(null);
                setObjects([]);
                setBackgroundImg(null);
                setActiveIndex(null);
              }}
              className="mr-4 bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition-colors"
            >
              ← Back
            </button>
          )}
          <h1 className="text-2xl font-semibold text-gray-800">Create Custom Post</h1>
        </div>

        {/* Size Grid */}
        {!showEditor && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {PRESET_SIZES.map((s) => (
              <button
                key={s.label}
                onClick={() => handleSizeSelect(s)}
                className="bg-white rounded-2xl p-8 shadow-md h-40 flex items-center justify-center hover:shadow-lg transition-shadow"
              >
                <span className="text-sm font-medium text-gray-700">{s.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Editor */}
        {showEditor && selectedSize && (
          <div className="mt-6 flex flex-col lg:flex-row gap-6">
            {/* Left: Canvas with poster upload */}
            <div className="flex-1 bg-white p-4 rounded-lg shadow">
              <div className="mb-3">
                <label className="block text-sm mb-1 font-medium text-gray-700">Upload Poster (Background)</label>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleUploadPoster} 
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100"
                />
              </div>
              <div className="border mt-3 rounded overflow-hidden inline-block">
                <canvas
                  ref={canvasRef}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  style={{
                    width: Math.min(600, selectedSize.w / 2),
                    height: "auto",
                    border: "1px solid #ccc",
                    cursor: dragging ? "grabbing" : "default"
                  }}
                />
              </div>

              {/* Download and Share Buttons */}
              <div className="mt-4 flex gap-3">
                <div className="relative">
                  <button 
                    onClick={() => setShowDownloadOptions(!showDownloadOptions)}
                    className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition-colors"
                  >
                    Download
                  </button>
                  
                  {showDownloadOptions && (
                    <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg p-2 z-10">
                      <button 
                        onClick={() => handleDownload('png')}
                        className="block w-full text-left px-4 py-2 hover:bg-pink-50 rounded"
                      >
                        PNG Format
                      </button>
                      <button 
                        onClick={() => handleDownload('jpeg')}
                        className="block w-full text-left px-4 py-2 hover:bg-pink-50 rounded"
                      >
                        JPEG Format
                      </button>
                    </div>
                  )}
                </div>
                
                <div className="relative">
                  <button 
                    onClick={() => setShowShareOptions(!showShareOptions)}
                    className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition-colors"
                  >
                    Share
                  </button>
                  
                  {showShareOptions && (
                    <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg p-2 z-10 w-40">
                      {navigator.share && (
                        <button 
                          onClick={() => handleShare('native')}
                          className="block w-full text-left px-4 py-2 hover:bg-pink-50 rounded"
                        >
                          Native Share
                        </button>
                      )}
                      <button 
                        onClick={() => handleShare('facebook')}
                        className="block w-full text-left px-4 py-2 hover:bg-pink-50 rounded"
                      >
                        Facebook
                      </button>
                      <button 
                        onClick={() => handleShare('twitter')}
                        className="block w-full text-left px-4 py-2 hover:bg-pink-50 rounded"
                      >
                        Twitter
                      </button>
                      <button 
                        onClick={() => handleShare('pinterest')}
                        className="block w-full text-left px-4 py-2 hover:bg-pink-50 rounded"
                      >
                        Pinterest
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Tools */}
            <div className="w-full lg:w-80 bg-white p-4 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-3 text-gray-800">Edit Tools</h2>

              {/* Background Color */}
              <div className="mb-4">
                <label className="block text-sm mb-1 font-medium text-gray-700">Background Color</label>
                <div className="flex items-center">
                  <input 
                    type="color" 
                    value={bgColor} 
                    onChange={(e) => setBgColor(e.target.value)} 
                    className="w-10 h-10 rounded cursor-pointer"
                  />
                  <span className="ml-2 text-sm text-gray-600">{bgColor}</span>
                </div>
              </div>

              {/* Add Buttons */}
              <div className="mb-4">
                <button 
                  onClick={handleAddText} 
                  className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition-colors w-full"
                >
                  Add Text
                </button>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm mb-1 font-medium text-gray-700">Logo Shape</label>
                <select
                  value={logoShape}
                  onChange={(e) => setLogoShape(e.target.value)}
                  className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                  {LOGO_SHAPES.map(shape => (
                    <option key={shape.value} value={shape.value}>{shape.label}</option>
                  ))}
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm mb-1 font-medium text-gray-700">Add Logo</label>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleAddLogo} 
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100"
                />
              </div>

              {/* Active Object Props */}
              {activeIndex !== null && objects[activeIndex] && (
                <div className="mt-4 border-t pt-3">
                  <h3 className="text-sm font-semibold mb-2 text-gray-800">Selected Object</h3>
                  {objects[activeIndex].type === "text" && (
                    <>
                      <label className="block text-sm mb-1 font-medium text-gray-700">Text Content</label>
                      <input
                        type="text"
                        value={textInput}
                        onChange={handleTextChange}
                        className="w-full border mb-3 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                        placeholder="Enter text here"
                      />
                      
                      <label className="block text-sm mb-1 font-medium text-gray-700">Font Family</label>
                      <select
                        value={objects[activeIndex].font}
                        onChange={(e) => updateActiveObject({ font: e.target.value })}
                        className="w-full border mb-3 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                      >
                        {FONT_OPTIONS.map(font => (
                          <option key={font} value={font}>{font}</option>
                        ))}
                      </select>
                      
                      <label className="block text-sm mb-1 font-medium text-gray-700">Font Size: {objects[activeIndex].size}px</label>
                      <input
                        type="range"
                        min="10"
                        max="100"
                        value={objects[activeIndex].size}
                        onChange={(e) => updateActiveObject({ size: parseInt(e.target.value) })}
                        className="w-full mb-3"
                      />
                      
                      <label className="block text-sm mb-1 font-medium text-gray-700">Text Color</label>
                      <div className="flex items-center mb-3">
                        <input
                          type="color"
                          value={objects[activeIndex].color}
                          onChange={(e) => updateActiveObject({ color: e.target.value })}
                          className="w-10 h-10 rounded cursor-pointer"
                        />
                        <span className="ml-2 text-sm text-gray-600">{objects[activeIndex].color}</span>
                      </div>
                      
                      <div className="flex gap-2 mt-2">
                        <button 
                          onClick={() => updateActiveObject({ bold: !objects[activeIndex].bold })} 
                          className={`px-3 py-2 border rounded-lg ${objects[activeIndex].bold ? 'bg-pink-100 border-pink-500' : 'bg-white'}`}
                        >
                          B
                        </button>
                        <button 
                          onClick={() => updateActiveObject({ italic: !objects[activeIndex].italic })} 
                          className={`px-3 py-2 border rounded-lg italic ${objects[activeIndex].italic ? 'bg-pink-100 border-pink-500' : 'bg-white'}`}
                        >
                          I
                        </button>
                      </div>
                    </>
                  )}

                  {objects[activeIndex].type === "image" && (
                    <>
                      <label className="block text-sm mb-1 font-medium text-gray-700">Logo Shape</label>
                      <select
                        value={objects[activeIndex].shape}
                        onChange={(e) => updateActiveObject({ shape: e.target.value })}
                        className="w-full border mb-3 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                      >
                        {LOGO_SHAPES.map(shape => (
                          <option key={shape.value} value={shape.value}>{shape.label}</option>
                        ))}
                      </select>
                      
                      <label className="block text-sm mb-1 font-medium text-gray-700">Resize: {objects[activeIndex].width}px</label>
                      <input
                        type="range"
                        min="50"
                        max="500"
                        value={objects[activeIndex].width}
                        onChange={(e) =>
                          updateActiveObject({
                            width: parseInt(e.target.value),
                            height: parseInt(e.target.value),
                          })
                        }
                        className="w-full mb-3"
                      />
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CustomPosterEditor;