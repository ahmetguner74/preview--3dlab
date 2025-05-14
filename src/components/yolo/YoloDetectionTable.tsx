
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { YoloApiResponse } from '@/utils/yoloApi';

interface YoloDetectionTableProps {
  apiResponse: YoloApiResponse;
}

export const YoloDetectionTable: React.FC<YoloDetectionTableProps> = ({ apiResponse }) => {
  if (!apiResponse.boxes || apiResponse.boxes.length === 0) {
    return (
      <Alert>
        <AlertDescription>
          Hiçbir nesne algılanmadı veya koordinat bilgisi bulunamadı.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>No</TableHead>
          <TableHead>Sınıf</TableHead>
          <TableHead>Doğruluk</TableHead>
          <TableHead>Koordinatlar</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {apiResponse.boxes.map((box, index) => (
          <TableRow key={index}>
            <TableCell>{index + 1}</TableCell>
            <TableCell>
              {apiResponse.classes && apiResponse.classes[index] !== undefined 
                ? `${apiResponse.classes[index]}` 
                : 'Bilinmeyen'}
            </TableCell>
            <TableCell>
              {apiResponse.scores && apiResponse.scores[index] !== undefined
                ? `%${(apiResponse.scores[index] * 100).toFixed(2)}`
                : '-'}
            </TableCell>
            <TableCell>
              <span className="text-xs font-mono">
                [{box.map(coord => coord.toFixed(1)).join(', ')}]
              </span>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
