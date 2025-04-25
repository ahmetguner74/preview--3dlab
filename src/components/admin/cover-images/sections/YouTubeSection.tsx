
import React, { useState } from 'react';
import YouTubeInput from '../YouTubeInput';

interface YouTubeSectionProps {
  title: string;
  description: string;
  inputValue: string;
  onYoutubeLinkChange?: (link: string, imageKey: string) => void;
  imageKey: string;
}

const YouTubeSection: React.FC<YouTubeSectionProps> = ({
  title,
  description,
  inputValue,
  onYoutubeLinkChange,
  imageKey
}) => {
  const [value, setValue] = useState(inputValue);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleSave = () => {
    onYoutubeLinkChange?.(value, imageKey);
  };

  return (
    <div className="border rounded-lg p-4 md:p-6 bg-white">
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-sm text-gray-500 mb-4">{description}</p>
      <YouTubeInput
        inputValue={value}
        onYoutubeLinkSave={handleSave}
        onInputChange={handleInputChange}
      />
    </div>
  );
};

export default YouTubeSection;
