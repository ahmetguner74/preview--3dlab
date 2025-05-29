
import React, { useState } from 'react';
import { Ruler, Square, MapPin, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

type MeasurementMode = 'none' | 'coordinate' | 'distance' | 'area';

interface MeasurementResult {
  id: string;
  type: MeasurementMode;
  value: string;
  coordinates?: string;
}

interface MeasurementToolsProps {
  onModeChange: (mode: MeasurementMode) => void;
  currentMode: MeasurementMode;
  results: MeasurementResult[];
  onClearResults: () => void;
}

const MeasurementTools: React.FC<MeasurementToolsProps> = ({
  onModeChange,
  currentMode,
  results,
  onClearResults
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const tools = [
    {
      mode: 'coordinate' as MeasurementMode,
      icon: <MapPin size={16} />,
      label: 'Koordinat',
      description: 'Nokta koordinatı ölç'
    },
    {
      mode: 'distance' as MeasurementMode,
      icon: <Ruler size={16} />,
      label: 'Mesafe',
      description: 'İki nokta arası mesafe'
    },
    {
      mode: 'area' as MeasurementMode,
      icon: <Square size={16} />,
      label: 'Alan',
      description: 'Polygon alanı hesapla'
    }
  ];

  const getResultIcon = (type: MeasurementMode) => {
    switch (type) {
      case 'coordinate':
        return <MapPin size={14} />;
      case 'distance':
        return <Ruler size={14} />;
      case 'area':
        return <Square size={14} />;
      default:
        return null;
    }
  };

  return (
    <Card className="absolute top-4 right-4 w-80 z-50 bg-white/95 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center gap-2">
            <Ruler size={20} />
            Ölçüm Araçları
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <X size={16} /> : <Ruler size={16} />}
          </Button>
        </CardTitle>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-2">
            {tools.map((tool) => (
              <Button
                key={tool.mode}
                variant={currentMode === tool.mode ? "default" : "outline"}
                className="justify-start h-auto p-3"
                onClick={() => onModeChange(tool.mode)}
              >
                <div className="flex items-center gap-3">
                  {tool.icon}
                  <div className="text-left">
                    <div className="font-medium">{tool.label}</div>
                    <div className="text-xs opacity-70">{tool.description}</div>
                  </div>
                </div>
              </Button>
            ))}
          </div>

          {currentMode !== 'none' && (
            <div className="p-2 bg-blue-50 rounded-md">
              <div className="text-sm font-medium text-blue-900 mb-1">
                Aktif: {tools.find(t => t.mode === currentMode)?.label}
              </div>
              <div className="text-xs text-blue-700">
                Harita üzerinde tıklayarak ölçüm yapın
              </div>
            </div>
          )}

          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Ölçüm Sonuçları</span>
              {results.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClearResults}
                  className="text-red-600 hover:text-red-700"
                >
                  <X size={14} className="mr-1" />
                  Temizle
                </Button>
              )}
            </div>
            
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {results.map((result) => (
                <div key={result.id} className="p-2 bg-gray-50 rounded text-xs">
                  <div className="flex items-center gap-1 mb-1">
                    {getResultIcon(result.type)}
                    <Badge variant="secondary" className="text-xs">
                      {tools.find(t => t.mode === result.type)?.label}
                    </Badge>
                  </div>
                  <div className="font-mono">{result.value}</div>
                  {result.coordinates && (
                    <div className="text-gray-600 mt-1">{result.coordinates}</div>
                  )}
                </div>
              ))}
              
              {results.length === 0 && (
                <div className="text-center text-gray-500 py-2">
                  <Ruler size={24} className="mx-auto mb-1 opacity-50" />
                  <p className="text-xs">Henüz ölçüm yapılmamış</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default MeasurementTools;
