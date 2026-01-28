import { 
  School, 
  BedDouble, 
  Utensils, 
  Dumbbell, 
  LayoutGrid,
  MapPin
} from "lucide-react";
import { cn } from "@/lib/utils";
import { type LocationCategory } from "@shared/schema";

interface CategoryFilterProps {
  selected: LocationCategory | null;
  onSelect: (category: LocationCategory | null) => void;
  className?: string;
}

export function CategoryFilter({ selected, onSelect, className }: CategoryFilterProps) {
  const categories: { id: LocationCategory | null; label: string; icon: any; color: string }[] = [
    { id: null, label: "All", icon: LayoutGrid, color: "bg-slate-500" },
    { id: 'faculty', label: "Faculties", icon: School, color: "bg-blue-500" },
    { id: 'dorm', label: "Dorms", icon: BedDouble, color: "bg-green-500" },
    { id: 'dining', label: "Dining", icon: Utensils, color: "bg-orange-500" },
    { id: 'sports', label: "Sports", icon: Dumbbell, color: "bg-purple-500" },
  ];

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {categories.map((cat) => {
        const isSelected = selected === cat.id;
        const Icon = cat.icon;
        
        return (
          <button
            key={cat.label}
            onClick={() => onSelect(cat.id)}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border",
              isSelected 
                ? "bg-foreground text-background border-transparent shadow-lg transform -translate-y-0.5" 
                : "bg-background/80 backdrop-blur-sm text-muted-foreground border-border/50 hover:bg-background hover:border-foreground/20 hover:text-foreground shadow-sm"
            )}
          >
            <div className={cn(
              "w-2 h-2 rounded-full",
              cat.color,
              isSelected ? "ring-2 ring-background" : ""
            )} />
            {cat.label}
          </button>
        );
      })}
    </div>
  );
}
