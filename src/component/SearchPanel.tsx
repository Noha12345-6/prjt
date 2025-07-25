import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Search, Navigation } from 'lucide-react';

export default function SearchPanel({ address, setAddress, suggestions, setSuggestions, isSearching, setIsSearching, onSelectSuggestion, onGetCurrentLocation }) {
  // Recherche d'adresse avec l'API Nominatim
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

  return (
    <Card className="shadow-lg border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Search className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          Search Address
        </CardTitle>
        <CardDescription>
          Enter an address to find its location
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input
              type="text"
              value={address}
              onChange={handleAddressChange}
              placeholder="Type an address..."
              className="pl-10 border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400"
            />
            {isSearching && (
              <div className="absolute right-3 top-3">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600" />
              </div>
            )}
          </div>
          {/* Suggestions Dropdown */}
          {suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 z-20 mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg overflow-hidden">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer border-b border-slate-100 dark:border-slate-700 last:border-0 transition-colors"
                  onClick={() => onSelectSuggestion(suggestion)}
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-slate-400" />
                    <span className="text-sm text-slate-900 dark:text-slate-100">
                      {suggestion.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <Button 
          onClick={onGetCurrentLocation}
          variant="outline" 
          className="w-full gap-2 border-slate-200 dark:border-slate-700"
        >
          <Navigation className="h-4 w-4" />
          Use Current Location
        </Button>
      </CardContent>
    </Card>
  );
} 