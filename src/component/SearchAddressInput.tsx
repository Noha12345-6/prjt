import { useState } from 'react';
import { MapPin } from 'lucide-react';

export default function SearchAddressInput({ value, onChange, onSelect }) {
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleAddressChange = async (e) => {
    onChange(e.target.value);
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

  const handleSuggestionClick = (suggestion) => {
    onChange(suggestion.label);
    setSuggestions([]);
    onSelect && onSelect(suggestion);
  };

  return (
    <div className="relative mb-2">
      <input
        type="text"
        value={value}
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
  );
} 