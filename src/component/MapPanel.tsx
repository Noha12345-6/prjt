import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin } from 'lucide-react';
import { ReactNode } from 'react';

export default function MapPanel({ position, onMapClick, children }: { position: [number, number]; onMapClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void; children?: ReactNode }) {
  return (
    <Card className="shadow-lg border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm h-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-red-500" />
            Interactive Map
          </div>
          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
            Click to place marker
          </Badge>
        </CardTitle>
        <CardDescription>
          Click anywhere on the map to set a location, or drag the marker
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="h-96 w-full relative">
          <div className="relative w-full h-full rounded-lg overflow-hidden border-2 border-slate-200 dark:border-slate-700">
            <iframe
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${position[1]-0.01},${position[0]-0.01},${position[1]+0.01},${position[0]+0.01}&layer=mapnik&marker=${position[0]},${position[1]}`}
              className="w-full h-full"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            {/* Overlay cliquable transparent */}
            <div 
              className="absolute inset-0 cursor-crosshair"
              onClick={onMapClick}
              style={{ background: 'transparent' }}
            />
            {/* Marqueur personnalisé */}
            <div 
              className="absolute transform -translate-x-1/2 -translate-y-full z-10 transition-all duration-200 pointer-events-none"
              style={{ left: '50%', top: '50%' }}
            >
              <div className="relative">
                <MapPin className="h-8 w-8 text-red-500 drop-shadow-lg" fill="currentColor" />
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-red-500 rounded-full opacity-30 animate-ping" />
              </div>
            </div>
            {children}
          </div>
        </div>
        {/* Map Instructions */}
        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-blue-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800 dark:text-blue-200">
              <div className="font-medium mb-1">How to use:</div>
              <ul className="space-y-1 text-xs">
                <li>• Click anywhere on the map to place a marker</li>
                <li>• Drag the red marker to adjust the position</li>
                <li>• Search for addresses using the search box</li>
                <li>• Use "Current Location" to get your GPS position</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 