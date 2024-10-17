import React, { useState } from 'react';

const ColorSelector = () => {
  const allColors = [
    'Red',
    'Green',
    'Blue',
    'Yellow',
    'Purple',
    'Orange',
    'Pink',
    'Brown',
    'Black',
    'White'
  ];

  const [selectedColor, setSelectedColor] = useState('');
  const [customColor, setCustomColor] = useState('#000000'); // Default black

  const handleColorChange = (color) => {
    setSelectedColor(color);
  };

  const handleCustomColorChange = (event) => {
    setCustomColor(event.target.value);
    setSelectedColor(event.target.value); // Set the selected color to the custom color
  };

  return (
    <div>
      <h2>Select a Color</h2>
      <div>
        {allColors.map((color) => (
          <label key={color} style={{ display: 'block' }}>
            <input
              type="radio"
              value={color}
              checked={selectedColor === color}
              onChange={() => handleColorChange(color)}
            />
            {color}
          </label>
        ))}
      </div>

      <div style={{ marginTop: '20px' }}>
        <label>
          <input
            type="radio"
            value="custom"
            checked={selectedColor === customColor}
            onChange={() => handleColorChange(customColor)}
          />
          Custom Color:
          <input
            type="color"
            value={customColor}
            onChange={handleCustomColorChange}
            style={{ marginLeft: '10px' }}
          />
        </label>
      </div>

      <div style={{ marginTop: '20px' }}>
        <h3>Selected Color:</h3>
        <div style={{ width: '100px', height: '100px', backgroundColor: selectedColor }}></div>
        <p>{selectedColor || 'None'}</p>
      </div>
    </div>
  );
};

export default ColorSelector;
