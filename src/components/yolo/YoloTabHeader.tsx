
import React from 'react';
import { Check, ImageIcon } from 'lucide-react';

interface YoloTabHeaderProps {
  icon: 'upload' | 'result';
  label: string;
}

export const YoloTabHeader: React.FC<YoloTabHeaderProps> = ({ icon, label }) => {
  return (
    <div className="flex items-center">
      {icon === 'upload' ? <ImageIcon className="mr-2 h-4 w-4" /> : <Check className="mr-2 h-4 w-4" />}
      {label}
    </div>
  );
};
