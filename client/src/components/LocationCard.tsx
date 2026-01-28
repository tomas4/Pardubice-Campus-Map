import { MapPin, ArrowRight } from "lucide-react";
import type { Location } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface LocationCardProps {
  location: Location;
  isSelected?: boolean;
  onClick: () => void;
}

const CATEGORY_STYLES = {
  faculty: "text-blue-600 bg-blue-50 border-blue-200",
  dorm: "text-green-600 bg-green-50 border-green-200",
  dining: "text-orange-600 bg-orange-50 border-orange-200",
  sports: "text-purple-600 bg-purple-50 border-purple-200",
  other: "text-gray-600 bg-gray-50 border-gray-200",
};

export function LocationCard({ location, isSelected, onClick }: LocationCardProps) {
  return (
    <div 
      onClick={onClick}
      className={cn(
        "group relative p-4 rounded-xl border transition-all duration-300 cursor-pointer overflow-hidden",
        isSelected 
          ? "bg-accent/5 border-accent shadow-md ring-1 ring-accent/20" 
          : "bg-card border-border hover:border-accent/40 hover:shadow-lg hover:-translate-y-0.5"
      )}
    >
      {/* Decorative gradient background on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="flex items-start justify-between gap-3 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge 
              variant="outline" 
              className={cn("text-[10px] uppercase tracking-wider h-5 px-2", CATEGORY_STYLES[location.category as keyof typeof CATEGORY_STYLES])}
            >
              {location.category}
            </Badge>
          </div>
          <h3 className="font-display font-bold text-foreground text-lg leading-tight group-hover:text-accent transition-colors">
            {location.name}
          </h3>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
            {location.description}
          </p>
          
          <div className="flex items-center gap-1 mt-3 text-xs text-muted-foreground/80">
            <MapPin className="w-3 h-3" />
            <span className="truncate max-w-[200px]">{location.address}</span>
          </div>
        </div>

        {location.imageUrl && (
          <div className="shrink-0 w-16 h-16 rounded-lg overflow-hidden border border-border/50 shadow-sm group-hover:shadow-md transition-shadow">
            <img 
              src={location.imageUrl} 
              alt={location.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>

      <div className="absolute right-4 bottom-4 opacity-0 transform translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
        <div className="bg-background/80 backdrop-blur-sm p-1.5 rounded-full text-accent shadow-sm border border-accent/20">
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
}
