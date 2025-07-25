import { useState } from 'react';
import { MapPin, Copy, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AddressMapField({ value, onChange }) {
  const [address, setAddress] = useState(value?.address || '');
  const [position, setPosition] = useState([value?.lat || 33.9716, value?.lng || -6.8498]);
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [copied, setCopied] = useState(false);

  // Recherche d'adresse
  const handleAddressChange = async (e) => {
    setAddress(e.target.value);
    if (e.target.value.length > 2) {
      setIsSearching(true);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(e.target.value)}&limit=5&addressdetails=1`
        );
        const results = await response.json();
        setSuggestions(results.map(result => ({
          label: result.display_name,
          y: parseFloat(result.lat),
          x: parseFloat(result.lon),
        })));
      } finally {
        setIsSearching(false);
      }
    } else {
      setSuggestions([]);
    }
  };

  // Sélection d'une suggestion
  const handleSuggestionClick = (suggestion) => {
    setAddress(suggestion.label);
    setPosition([suggestion.y, suggestion.x]);
    setSuggestions([]);
    onChange && onChange({ address: suggestion.label, lat: suggestion.y, lng: suggestion.x });
  };

  // Clic sur la carte (reverse geocoding)
  const handleMapClick = async (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const lat = position[0] + (0.5 - y) * 0.02;
    const lng = position[1] + (x - 0.5) * 0.02;
    setPosition([lat, lng]);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
      );
      const result = await response.json();
      if (result && result.display_name) {
        setAddress(result.display_name);
        onChange && onChange({ address: result.display_name, lat, lng });
      }
    } catch {}
  };

  // Copier les coordonnées
  const copyCoordinates = () => {
    const coords = `${position[0].toFixed(6)}, ${position[1].toFixed(6)}`;
    navigator.clipboard.writeText(coords);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <label className="block mb-2 font-semibold">Adresse</label>
      <div className="relative mb-2">
        <input
          type="text"
          value={address}
          onChange={handleAddressChange}
          placeholder="Tapez une adresse…"
          className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        />
        {isSearching && (
          <div className="absolute right-3 top-3">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600" />
          </div>
        )}
        {suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 z-20 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="px-4 py-3 hover:bg-slate-50 cursor-pointer border-b border-slate-100 last:border-0 transition-colors"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-slate-400" />
                  <span className="text-sm text-slate-900">{suggestion.label}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="h-64 w-full rounded-lg overflow-hidden border-2 border-slate-200 mb-2 cursor-grab" onClick={handleMapClick}>
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
      <div className="flex gap-2 items-center">
        <span className="text-xs text-slate-500">Lat: {position[0].toFixed(6)}</span>
        <span className="text-xs text-slate-500">Lng: {position[1].toFixed(6)}</span>
        <Button size="sm" variant="outline" onClick={copyCoordinates}>
          {copied ? <CheckCircle2 className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
} 