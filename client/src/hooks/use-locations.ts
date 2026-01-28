import { useQuery } from "@tanstack/react-query";
import { api, type LocationCategory } from "@shared/routes";
import type { Location } from "@shared/schema";

export function useLocations(category?: LocationCategory | null) {
  return useQuery({
    queryKey: [api.locations.list.path, category],
    queryFn: async () => {
      const url = new URL(api.locations.list.path, window.location.origin);
      if (category) {
        url.searchParams.append("category", category);
      }
      
      const res = await fetch(url.toString(), { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch locations");
      
      const data = await res.json();
      return api.locations.list.responses[200].parse(data);
    },
  });
}

export function useLocation(id: number) {
  return useQuery({
    queryKey: [api.locations.get.path, id],
    queryFn: async () => {
      const url = api.locations.get.path.replace(":id", id.toString());
      const res = await fetch(url, { credentials: "include" });
      
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch location");
      
      const data = await res.json();
      return api.locations.get.responses[200].parse(data);
    },
    enabled: !!id,
  });
}
