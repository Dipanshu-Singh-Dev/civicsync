import React from "react"; // Standard React import
import { Card, CardHeader, CardContent } from "@/components/ui/card";

export default function IssueGrid() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-w-6xl w-full mx-auto">
      <Card>
        <CardHeader className="p-0">
          <img
            src="/placeholder.svg" // Assumes image is in public folder
            alt="Project"
            width="400"
            height="225"
            className="aspect-video object-cover"
          />
        </CardHeader>
        <CardContent className="p-4">
          <div className="text-xl font-bold">Next.js App</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Created 2 days ago
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="p-0">
          <img
            src="/placeholder.svg"
            alt="Project"
            width="400"
            height="225"
            className="aspect-video object-cover"
          />
        </CardHeader>
        <CardContent className="p-4">
          <div className="text-xl font-bold">SvelteKit Site</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Created 1 day ago
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="p-0">
          <img
            src="/placeholder.svg"
            alt="Project"
            width="400"
            height="225"
            className="aspect-video object-cover"
          />
        </CardHeader>
        <CardContent className="p-4">
          <div className="text-xl font-bold">Vue 3 App</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Created 3 days ago
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="p-0">
          <img
            src="/placeholder.svg"
            alt="Project"
            width="400"
            height="225"
            className="aspect-video object-cover"
          />
        </CardHeader>
        <CardContent className="p-4">
          <div className="text-xl font-bold">React Site</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Created 4 days ago
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
