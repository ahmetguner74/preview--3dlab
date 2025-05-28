
import React, { useState, KeyboardEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

interface LayerTagInputProps {
  layers: string[];
  onChange: (layers: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
}

const LayerTagInput: React.FC<LayerTagInputProps> = ({
  layers,
  onChange,
  placeholder = "Katman adı yazın ve Enter'a basın...",
  disabled = false
}) => {
  const [inputValue, setInputValue] = useState('');

  const addLayer = (layerName: string) => {
    const trimmed = layerName.trim();
    if (trimmed && !layers.includes(trimmed)) {
      onChange([...layers, trimmed]);
      setInputValue('');
    }
  };

  const removeLayer = (index: number) => {
    const newLayers = layers.filter((_, i) => i !== index);
    onChange(newLayers);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addLayer(inputValue);
    } else if (e.key === 'Backspace' && inputValue === '' && layers.length > 0) {
      removeLayer(layers.length - 1);
    }
  };

  const handleInputChange = (value: string) => {
    // Virgül varsa otomatik olarak katman ekle
    if (value.includes(',')) {
      const newLayers = value.split(',').map(l => l.trim()).filter(l => l);
      newLayers.forEach(layer => addLayer(layer));
    } else {
      setInputValue(value);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2 min-h-[40px] p-2 border rounded-md bg-background">
        {layers.map((layer, index) => (
          <Badge key={index} variant="secondary" className="flex items-center gap-1">
            {layer}
            {!disabled && (
              <button
                type="button"
                onClick={() => removeLayer(index)}
                className="hover:bg-destructive hover:text-destructive-foreground rounded-full p-1"
              >
                <X size={12} />
              </button>
            )}
          </Badge>
        ))}
        {!disabled && (
          <Input
            value={inputValue}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={layers.length === 0 ? placeholder : ""}
            className="border-none bg-transparent flex-1 min-w-[120px] focus-visible:ring-0 focus-visible:ring-offset-0"
            disabled={disabled}
          />
        )}
      </div>
      <p className="text-xs text-gray-500">
        Katman adlarını yazın ve Enter'a basın. Virgülle ayırarak birden fazla katman ekleyebilirsiniz.
      </p>
    </div>
  );
};

export default LayerTagInput;
