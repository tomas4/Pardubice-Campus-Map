import { useState, useMemo, useEffect } from "react";
import { MapContainer, TileLayer, ZoomControl, useMap } from "react-leaflet";
import { useLocations } from "@/hooks/use-locations";
import { MapMarker } from "@/components/MapMarker";
import { CategoryFilter } from "@/components/CategoryFilter";
import { LocationCard } from "@/components/LocationCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Menu, X, LocateFixed, Globe } from "lucide-react";
import type { Location, LocationCategory } from "@shared/schema";
import { motion, AnimatePresence } from "framer-motion";
import "leaflet/dist/leaflet.css";

// Helper component to fly map to specific coordinates
function MapFlyTo({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, {
      duration: 1.5,
      easeLinearity: 0.25,
    });
  }, [center, zoom, map]);
  return null;
}

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<LocationCategory | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(typeof window !== "undefined" ? window.innerWidth >= 768 : false);
  const [mapCenter, setMapCenter] = useState<[number, number]>([50.0495, 15.766]);
  const [mapZoom, setMapZoom] = useState(15);

  const { data: locations, isLoading } = useLocations(selectedCategory);

  // Filter locations by search query (client-side)
  const filteredLocations = useMemo(() => {
    if (!locations) return [];
    if (!searchQuery) return locations;
    return locations.filter((loc) =>
      loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [locations, searchQuery]);

  // Handle location selection from sidebar
  const handleLocationSelect = (location: Location) => {
    setSelectedLocation(location);
    setMapCenter([location.latitude, location.longitude]);
    setMapZoom(17);
    // On mobile, close sidebar after selection
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  // Handle Litomyšl shortcut
  const handleLitomyslClick = () => {
    setMapCenter([49.8728, 16.3144]);
    setMapZoom(16);
    setSelectedCategory('faculty');
  };

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden relative">
      
      {/* Mobile Header / Sidebar Toggle */}
      <div className="absolute top-4 left-4 z-[1000]">
        <Button 
          variant="secondary" 
          size="icon" 
          className="rounded-full shadow-lg h-12 w-12 bg-background/90 backdrop-blur-md border border-border/50"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          data-testid="button-toggle-menu"
        >
          {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Sidebar List */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.aside
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute md:relative z-[900] h-full w-full md:w-[400px] bg-background/95 md:bg-background backdrop-blur-md border-r border-border shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-border/50 bg-background/50">
              <div className="mb-4">
                <h1 className="text-2xl font-display font-extrabold text-primary tracking-tight">
                  Campus Guide
                </h1>
                <p className="text-sm text-muted-foreground font-medium">
                  University of Pardubice
                </p>
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Find faculty, food, dorms..."
                  className="pl-9 bg-secondary/50 border-transparent focus:bg-background transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="mt-4">
                <CategoryFilter
                  selected={selectedCategory}
                  onSelect={setSelectedCategory}
                />
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
              {isLoading ? (
                <div className="space-y-4 pt-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-32 rounded-xl bg-secondary/50 animate-pulse" />
                  ))}
                </div>
              ) : filteredLocations.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <p>No locations found.</p>
                  <Button 
                    variant="link" 
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory(null);
                    }}
                  >
                    Clear filters
                  </Button>
                </div>
              ) : (
                filteredLocations.map((loc) => (
                  <LocationCard
                    key={loc.id}
                    location={loc}
                    isSelected={selectedLocation?.id === loc.id}
                    onClick={() => handleLocationSelect(loc)}
                  />
                ))
              )}
            </div>

            {/* Footer / Credits */}
            <div className="p-4 border-t border-border/50 bg-secondary/20 text-xs text-center text-muted-foreground">
              <p>Welcome to Pardubice! 🎓</p>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Map Area */}
      <main className="flex-1 relative h-full w-full">
        {/* Quick Navigation Buttons */}
        <div className="absolute top-20 right-4 z-[800] flex flex-col gap-2 sm:gap-3">
          <Button
            variant="default"
            size="sm"
            onClick={() => {
              setMapCenter([50.0495, 15.766]);
              setMapZoom(15);
              setSelectedCategory(null);
            }}
            className="shadow-xl rounded-full px-4 sm:px-6 bg-white hover:bg-white/90 text-primary border border-primary/20 font-semibold text-xs sm:text-sm whitespace-nowrap"
            data-testid="button-main-campus"
          >
            <LocateFixed className="w-4 h-4 mr-2 sm:mr-2" />
            Main Campus
          </Button>
          
          <Button
            variant="default"
            size="sm"
            onClick={() => {
              setMapCenter([49.8728, 16.3144]);
              setMapZoom(16);
              setSelectedCategory("faculty");
            }}
            className="shadow-xl rounded-full px-4 sm:px-6 bg-white hover:bg-white/90 text-primary border border-primary/20 font-semibold text-xs sm:text-sm whitespace-nowrap"
            data-testid="button-litomysl"
          >
            <Globe className="w-4 h-4 mr-2 sm:mr-2" />
            Litomyšl Campus
          </Button>

          <Button
            variant="default"
            size="sm"
            onClick={() => {
              setMapCenter([50.0465, 15.7950]);
              setMapZoom(16);
              setSelectedCategory("faculty");
            }}
            className="shadow-xl rounded-full px-4 sm:px-6 bg-white hover:bg-white/90 text-primary border border-primary/20 font-semibold text-xs sm:text-sm whitespace-nowrap"
            data-testid="button-health-studies"
          >
            <LocateFixed className="w-4 h-4 mr-2 sm:mr-2" />
            Health Studies
          </Button>
        </div>

        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          className="h-full w-full outline-none bg-secondary/20"
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ZoomControl position="bottomright" />
          <MapFlyTo center={mapCenter} zoom={mapZoom} />

          {locations?.map((loc) => (
            <MapMarker
              key={loc.id}
              location={loc}
              onSelect={setSelectedLocation}
            />
          ))}
        </MapContainer>
      </main>
    </div>
  );
}
