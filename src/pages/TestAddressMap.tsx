import { useState } from 'react';
import SearchPanel from '@/component/SearchPanel';
import CoordinatesPanel from '@/component/CoordinatesPanel';
import MapPanel from '@/component/MapPanel';
import { MapPin } from 'lucide-react';

export default function TestAddressMap() {
  const [address, setAddress] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [position, setPosition] = useState<[number, number]>([33.9716, -6.8498]); // Rabat, Morocco par défaut
  const [isSearching, setIsSearching] = useState(false);

  const handleSelectSuggestion = (suggestion: { label: string; y: number; x: number }) => {
    setAddress(suggestion.label);
    setPosition([suggestion.y, suggestion.x]);
    setSuggestions([]);
  };

  const handleMapClick = async (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
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
      }
    } catch (error) {
      // ignore
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPosition([pos.coords.latitude, pos.coords.longitude]);
          setAddress('Current Location');
        },
        () => {
          alert('Unable to retrieve your location');
        }
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            Address Location Picker
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Search for an address or click on the map to set a location
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Search Panel */}
          <div className="lg:col-span-1 space-y-4">
            <SearchPanel
              address={address}
              setAddress={setAddress}
              suggestions={suggestions}
              setSuggestions={setSuggestions}
              isSearching={isSearching}
              setIsSearching={setIsSearching}
              onSelectSuggestion={handleSelectSuggestion}
              onGetCurrentLocation={getCurrentLocation}
            />
            <CoordinatesPanel position={position} />
          </div>
          {/* Map Panel */}
          <div className="lg:col-span-2">
            <MapPanel position={position} onMapClick={handleMapClick} />
          </div>
        </div>
        {/* Footer Info */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/50 dark:bg-slate-800/50 rounded-full border border-slate-200 dark:border-slate-700">
            <MapPin className="h-4 w-4 text-slate-500" />
            <span className="text-sm text-slate-600 dark:text-slate-400">
              Powered by OpenStreetMap & Leaflet
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}