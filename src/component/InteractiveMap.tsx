import { MapPin } from 'lucide-react';

export default function InteractiveMap({ position, onMapClick }) {
  return (
    <div className="h-64 w-full rounded-lg overflow-hidden border-2 border-slate-200 mb-2 cursor-grab relative" onClick={onMapClick}>
      <iframe
        src={`https://www.openstreetmap.org/export/embed.html?bbox=${position[1]-0.01},${position[0]-0.01},${position[1]+0.01},${position[0]+0.01}&layer=mapnik&marker=${position[0]},${position[1]}`}
        className="w-full h-full"
        style={{ border: 0 }}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full z-10 pointer-events-none">
        <MapPin className="h-8 w-8 text-red-500 drop-shadow-lg" fill="currentColor" />
      </div>
    </div>
  );
} 