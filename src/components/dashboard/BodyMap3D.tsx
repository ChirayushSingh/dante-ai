import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import './body-map.css';

interface BodyMapProps {
  highlightedAreas?: string[];
  onAreaClick?: (area: string) => void;
}

const BODY_AREAS = [
  { id: 'head', name: 'Head', color: '#ff6b6b', fill: '#ffe0e0' },
  { id: 'chest', name: 'Chest', color: '#4ecdc4', fill: '#e0f7f6' },
  { id: 'abdomen', name: 'Abdomen', color: '#45b7d1', fill: '#e0f4f9' },
  { id: 'left-arm', name: 'Left Arm', color: '#96ceb4', fill: '#e8f5f0' },
  { id: 'right-arm', name: 'Right Arm', color: '#96ceb4', fill: '#e8f5f0' },
  { id: 'left-leg', name: 'Left Leg', color: '#ffeaa7', fill: '#fffbf0' },
  { id: 'right-leg', name: 'Right Leg', color: '#ffeaa7', fill: '#fffbf0' },
];

const AreaColorDot = ({ color }: { color: string }) => {
  return (
    <div
      className="body-map-color-dot"
      data-color={color}
    />
  );
};

export function InteractiveBodyMap({ highlightedAreas = [], onAreaClick }: BodyMapProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Interactive Body Map</CardTitle>
        <CardDescription>Click on body parts to report symptoms</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* SVG Body Map */}
        <div className="flex justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-6 rounded-lg">
          <svg
            viewBox="0 0 200 500"
            className="w-32 h-96 max-w-full body-map-svg"
          >
            {/* Head */}
            <circle
              cx="100"
              cy="50"
              r="30"
              fill={highlightedAreas.includes('Head') ? '#ff6b6b' : '#ffe0e0'}
              stroke="#ff6b6b"
              strokeWidth="2"
              className="body-map-area"
              onClick={() => onAreaClick?.('Head')}
            />

            {/* Chest */}
            <rect
              x="75"
              y="85"
              width="50"
              height="60"
              rx="8"
              fill={highlightedAreas.includes('Chest') ? '#4ecdc4' : '#e0f7f6'}
              stroke="#4ecdc4"
              strokeWidth="2"
              className="body-map-area"
              onClick={() => onAreaClick?.('Chest')}
            />

            {/* Abdomen */}
            <rect
              x="75"
              y="150"
              width="50"
              height="50"
              rx="8"
              fill={highlightedAreas.includes('Abdomen') ? '#45b7d1' : '#e0f4f9'}
              stroke="#45b7d1"
              strokeWidth="2"
              className="body-map-area"
              onClick={() => onAreaClick?.('Abdomen')}
            />

            {/* Left Arm */}
            <rect
              x="25"
              y="95"
              width="45"
              height="70"
              rx="8"
              fill={highlightedAreas.includes('Left Arm') ? '#96ceb4' : '#e8f5f0'}
              stroke="#96ceb4"
              strokeWidth="2"
              className="body-map-area"
              onClick={() => onAreaClick?.('Left Arm')}
            />

            {/* Right Arm */}
            <rect
              x="130"
              y="95"
              width="45"
              height="70"
              rx="8"
              fill={highlightedAreas.includes('Right Arm') ? '#96ceb4' : '#e8f5f0'}
              stroke="#96ceb4"
              strokeWidth="2"
              className="body-map-area"
              onClick={() => onAreaClick?.('Right Arm')}
            />

            {/* Left Leg */}
            <rect
              x="55"
              y="210"
              width="35"
              height="80"
              rx="8"
              fill={highlightedAreas.includes('Left Leg') ? '#ffeaa7' : '#fffbf0'}
              stroke="#ffeaa7"
              strokeWidth="2"
              className="body-map-area"
              onClick={() => onAreaClick?.('Left Leg')}
            />

            {/* Right Leg */}
            <rect
              x="110"
              y="210"
              width="35"
              height="80"
              rx="8"
              fill={highlightedAreas.includes('Right Leg') ? '#ffeaa7' : '#fffbf0'}
              stroke="#ffeaa7"
              strokeWidth="2"
              className="body-map-area"
              onClick={() => onAreaClick?.('Right Leg')}
            />
          </svg>
        </div>

        {/* Body Area Buttons */}
        <div className="grid grid-cols-2 gap-2">
          {BODY_AREAS.map((area) => (
            <Button
              key={area.id}
              variant={highlightedAreas.includes(area.name) ? 'default' : 'outline'}
              onClick={() => onAreaClick?.(area.name)}
              className="w-full text-xs sm:text-sm"
              size="sm"
            >
              <AreaColorDot color={area.color} />
              <span className="truncate">{area.name}</span>
            </Button>
          ))}
        </div>

        {/* Selected Areas Display */}
        {highlightedAreas.length > 0 && (
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <p className="text-xs font-semibold text-blue-900 mb-2">Reported Symptoms:</p>
            <div className="flex flex-wrap gap-1">
              {highlightedAreas.map((area) => (
                <Badge key={area} variant="secondary" className="text-xs">
                  {area}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Info */}
        <div className="text-xs text-gray-500 text-center">
          <p>👆 Click on body parts to select symptom areas</p>
        </div>
      </CardContent>
    </Card>
  );
}
