import { Map } from 'lucide-react';

export function MapPlaceholder() {
  return (
    <div className="sticky top-20">
        <div className="aspect-video w-full rounded-lg bg-muted flex flex-col items-center justify-center p-4 text-center border-2 border-dashed">
            <Map className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="font-semibold text-lg text-muted-foreground">Map Visualization</h3>
            <p className="text-sm text-muted-foreground">An interactive map of reported issues will be displayed here.</p>
        </div>
    </div>
  );
}
