import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md mx-auto shadow-xl">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2 text-destructive font-bold text-2xl items-center">
            <AlertCircle className="w-8 h-8" />
            <h1>404 Page Not Found</h1>
          </div>

          <p className="mt-4 text-sm text-gray-600 mb-6">
            The page you are looking for does not exist. It might have been moved or deleted.
          </p>

          <Link href="/" className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full">
            Return to Map
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
