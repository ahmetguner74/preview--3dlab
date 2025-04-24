
import React, { useState } from 'react';

interface YouTubeInputProps {
  inputValue: string;
  onYoutubeLinkSave: () => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const YouTubeInput: React.FC<YouTubeInputProps> = ({
  inputValue,
  onYoutubeLinkSave,
  onInputChange
}) => {
  return (
    <div className="mb-4">
      <input
        type="text"
        placeholder="YouTube linki veya iframe kodu"
        value={inputValue}
        onChange={onInputChange}
        className="w-full border rounded px-3 py-2 mb-2"
      />
      <button
        onClick={onYoutubeLinkSave}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm"
      >
        Kaydet
      </button>
      <p className="text-xs text-gray-500 mt-2">
        YouTube normal video linki (<strong>youtube.com/watch?v=VIDEO_ID</strong>), embed linki 
        (<strong>youtube.com/embed/VIDEO_ID</strong>) veya iframe kodu girebilirsiniz.
      </p>
    </div>
  );
};

export default YouTubeInput;
