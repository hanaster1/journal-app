"use client";

import { Button } from "@/components/ui/button";
import { LayoutGrid, Table } from "lucide-react";

interface ViewToggleProps {
  view: "cards" | "table";
  onViewChange: (view: "cards" | "table") => void;
}

export function ViewToggle({ view, onViewChange }: ViewToggleProps) {
  return (
    <div className="flex items-center gap-1">
      <Button
        variant={view === "table" ? "default" : "ghost"}
        size="icon"
        onClick={() => onViewChange("table")}
        className="h-8 w-8"
      >
        <Table className="h-4 w-4" />
      </Button>
      <Button
        variant={view === "cards" ? "default" : "ghost"}
        size="icon"
        onClick={() => onViewChange("cards")}
        className="h-8 w-8"
      >
        <LayoutGrid className="h-4 w-4" />
      </Button>
    </div>
  );
}
