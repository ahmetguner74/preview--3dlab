
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { ImageIcon } from 'lucide-react';

interface TourCardProps {
  id: string;
  title: string;
  description?: string | null;
  thumbnail?: string | null;
  slug: string;
}

const TourCard: React.FC<TourCardProps> = ({
  title,
  description,
  thumbnail,
  slug
}) => {
  return (
    <Link to={`/virtual-tours/${slug}`} className="block">
      <Card className="overflow-hidden h-full transition-all hover:shadow-lg">
        <div className="aspect-[16/9] overflow-hidden bg-gray-100">
          {thumbnail ? (
            <img
              src={thumbnail}
              alt={title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <ImageIcon className="w-12 h-12 text-gray-400" />
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold mb-2">{title}</h3>
          {description && (
            <p className="text-gray-600 text-sm line-clamp-2">{description}</p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
};

export default TourCard;
