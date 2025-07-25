import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crosshair, Copy, CheckCircle2 } from 'lucide-react';

export default function CoordinatesPanel({ position }) {
  const [copied, setCopied] = useState(false);
  const copyCoordinates = () => {
    const coords = `${position[0].toFixed(6)}, ${position[1].toFixed(6)}`;
    navigator.clipboard.writeText(coords);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <Card className="shadow-lg border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Crosshair className="h-5 w-5 text-green-600 dark:text-green-400" />
          Coordinates
        </CardTitle>
        <CardDescription>
          Current location coordinates
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">Latitude</div>
              <div className="font-mono text-sm font-medium text-slate-900 dark:text-slate-100">
                {position[0].toFixed(6)}
              </div>
            </div>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
              LAT
            </Badge>
          </div>
          <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">Longitude</div>
              <div className="font-mono text-sm font-medium text-slate-900 dark:text-slate-100">
                {position[1].toFixed(6)}
              </div>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
              LNG
            </Badge>
          </div>
        </div>
        <Button 
          onClick={copyCoordinates}
          variant="outline" 
          className="w-full gap-2 border-slate-200 dark:border-slate-700"
          disabled={copied}
        >
          {copied ? (
            <>
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              Copy Coordinates
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
} 