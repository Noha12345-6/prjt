import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Search, 
  Navigation, 
  Crosshair,
  Copy,
  CheckCircle2
} from 'lucide-react';

// API de géocodage utilisant Nominatim (OpenStreetMap)
const searchPlaces = async (query) => {
  if (query.length < 3) return [];
  
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`
    );
    const results = await response.json();
    
    return results.map(result => ({
      label: result.display_name,
      y: parseFloat(result.lat),
      x: parseFloat(result.lon),
      place_id: result.place_id
    }));
  } catch (error) {
    console.error('Erreur lors de la recherche:', error);
    return [];
  }
};

// Composant de carte avec OpenStreetMap intégrée
function InteractiveMap({ center, children, onClick }) {
  const mapId = `map-${Date.now()}`;
  
  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden border-2 border-slate-200 dark:border-slate-700">
      <iframe
        src={`https://www.openstreetmap.org/export/embed.html?bbox=${center[1]-0.01},${center[0]-0.01},${center[1]+0.01},${center[0]+0.01}&layer=mapnik&marker=${center[0]},${center[1]}`}
        className="w-full h-full"
        style={{ border: 0 }}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
      
      {/* Overlay cliquable transparent */}
      <div 
        className="absolute inset-0 cursor-crosshair"
        onClick={onClick}
        style={{ background: 'transparent' }}
      />
      
      {/* Marqueur personnalisé */}
      <div 
        className="absolute transform -translate-x-1/2 -translate-y-full z-10 transition-all duration-200 pointer-events-none"
        style={{
          left: '50%',
          top: '50%'
        }}
      >
        <div className="relative">
          <MapPin className="h-8 w-8 text-red-500 drop-shadow-lg" fill="currentColor" />
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-red-500 rounded-full opacity-30 animate-ping" />
        </div>
      </div>
      
      {children}
    </div>
  );
}

function DraggableMarker({ position, setPosition }) {
  // Dans la vraie implémentation, ceci utiliserait useMapEvents de react-leaflet
  return null;
}

export default function TestAddressMap() {
  const [address, setAddress] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [position, setPosition] = useState([33.9716, -6.8498]); // Rabat, Morocco par défaut
  const [isSearching, setIsSearching] = useState(false);
  const [copied, setCopied] = useState(false);

  // Recherche d'adresse avec l'API Nominatim
  const handleAddressChange = async (e) => {
    setAddress(e.target.value);
    if (e.target.value.length > 2) {
      setIsSearching(true);
      try {
        const results = await searchPlaces(e.target.value);
        setSuggestions(results);
      } catch (error) {
        console.error('Erreur de recherche:', error);
        setSuggestions([]);
      } finally {
        setIsSearching(false);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setAddress(suggestion.label);
    setPosition([suggestion.y, suggestion.x]);
    setSuggestions([]);
  };

  const handleMapClick = async (e) => {
    // Géocodage inverse pour obtenir l'adresse du point cliqué
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    // Calcul approximatif des coordonnées basé sur la vue de la carte
    const lat = position[0] + (0.5 - y) * 0.02; // Ajustement plus précis
    const lng = position[1] + (x - 0.5) * 0.02;
    
    setPosition([lat, lng]);
    
    // Géocodage inverse pour obtenir le nom du lieu
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
      );
      const result = await response.json();
      if (result && result.display_name) {
        setAddress(result.display_name);
      }
    } catch (error) {
      console.error('Erreur géocodage inverse:', error);
    }
  };

  const copyCoordinates = () => {
    const coords = `${position[0].toFixed(6)}, ${position[1].toFixed(6)}`;
    navigator.clipboard.writeText(coords);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
                          onClick={() => handleSuggestionClick(suggestion)}
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
                  onClick={getCurrentLocation}
                  variant="outline" 
                  className="w-full gap-2 border-slate-200 dark:border-slate-700"
                >
                  <Navigation className="h-4 w-4" />
                  Use Current Location
                </Button>
              </CardContent>
            </Card>

            {/* Coordinates Panel */}
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
          </div>

          {/* Map Panel */}
          <div className="lg:col-span-2">
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
                <div className="h-96 w-full cursor-grab">
                  <InteractiveMap center={position} onClick={handleMapClick}>
                    <DraggableMarker position={position} setPosition={setPosition} />
                  </InteractiveMap>
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