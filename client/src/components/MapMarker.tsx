import { Marker, Popup } from "react-leaflet";
import { DivIcon } from "leaflet";
import { renderToStaticMarkup } from "react-dom/server";
import { 
  School, 
  BedDouble, 
  Utensils, 
  Dumbbell, 
  MapPin, 
  ExternalLink,
  Info
} from "lucide-react";
import type { Location } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const ICONS = {
  faculty: School,
  dorm: BedDouble,
  dining: Utensils,
  sports: Dumbbell,
  other: MapPin,
};

const COLORS = {
  faculty: "bg-blue-500 text-white shadow-blue-500/40",
  dorm: "bg-green-500 text-white shadow-green-500/40",
  dining: "bg-orange-500 text-white shadow-orange-500/40",
  sports: "bg-purple-500 text-white shadow-purple-500/40",
  other: "bg-gray-500 text-white shadow-gray-500/40",
};

interface MapMarkerProps {
  location: Location;
  onSelect?: (location: Location) => void;
}

export function MapMarker({ location, onSelect }: MapMarkerProps) {
  const IconComponent = ICONS[location.category as keyof typeof ICONS] || MapPin;
  const colorClass = COLORS[location.category as keyof typeof COLORS] || COLORS.other;

  // Create custom DivIcon
  const iconMarkup = renderToStaticMarkup(
    <div className={`
      relative flex items-center justify-center w-10 h-10 rounded-full 
      transform -translate-x-1/2 -translate-y-1/2 shadow-lg border-2 border-white
      transition-all duration-300 hover:scale-110 hover:z-50
      ${colorClass}
    `}>
      <IconComponent className="w-5 h-5" strokeWidth={2.5} />
      <div className="absolute -bottom-1 left-1/2 w-2 h-2 bg-inherit transform -translate-x-1/2 rotate-45" />
    </div>
  );

  const customIcon = new DivIcon({
    html: iconMarkup,
    className: "bg-transparent border-none", // Remove default leaflet styles
    iconSize: [40, 40],
    iconAnchor: [20, 42], // Tip of the pin
    popupAnchor: [0, -42],
  });

  return (
    <Marker 
      position={[location.latitude, location.longitude]} 
      icon={customIcon}
      eventHandlers={{
        click: () => onSelect?.(location),
      }}
    >
      <Popup closeButton={false} className="!m-0 !p-0">
        <div className="flex flex-col">
          {location.imageUrl && (
            <div className="relative h-32 w-full overflow-hidden">
               {/* HTML Comment for stock image replacement if URL breaks */}
               {/* University campus building photo */}
              <img 
                src={location.imageUrl} 
                alt={location.name} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <Badge 
                className={`absolute bottom-3 left-3 capitalize border-none text-white/90 backdrop-blur-sm ${
                  location.category === 'faculty' ? 'bg-blue-600/80' : 
                  location.category === 'dorm' ? 'bg-green-600/80' : 
                  location.category === 'dining' ? 'bg-orange-600/80' : 
                  'bg-gray-600/80'
                }`}
              >
                {location.category}
              </Badge>
            </div>
          )}
          
          <div className="p-4 space-y-3">
            <div>
              <h3 className="text-lg font-display font-bold leading-tight text-foreground">
                {location.name}
              </h3>
              <p className="text-xs text-muted-foreground mt-1 flex items-start gap-1">
                <MapPin className="w-3 h-3 mt-0.5 shrink-0" />
                {location.address}
              </p>
            </div>
            
            <p className="text-sm text-foreground/80 leading-relaxed line-clamp-3">
              {location.description}
            </p>

            <div className="pt-2 flex items-center justify-between border-t border-border/50">
              {location.websiteUrl ? (
                <Button 
                  size="sm" 
                  className="w-full gap-2 font-semibold" 
                  onClick={() => window.open(location.websiteUrl!, '_blank')}
                >
                  <ExternalLink className="w-4 h-4" />
                  Visit Website
                </Button>
              ) : (
                <div className="text-xs text-muted-foreground italic flex items-center gap-1">
                  <Info className="w-3 h-3" /> No website available
                </div>
              )}
            </div>
          </div>
        </div>
      </Popup>
    </Marker>
  );
}
