"use client";

import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FilterSectionProps {
  title: string;
  count?: number;
  children: React.ReactNode;
  defaultValue?: boolean;
}

export function FilterSection({
  title,
  count = 0,
  children,
  defaultValue = false,
}: FilterSectionProps) {
  return (
    <Accordion defaultValue={defaultValue ? ["item"] : undefined}>
      <AccordionItem value="item" className="border-b">
        <AccordionTrigger className="hover:no-underline">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{title}</span>
            {count > 0 && (
              <Badge variant="secondary" className="text-xs">
                {count}
              </Badge>
            )}
          </div>
        </AccordionTrigger>
        <AccordionContent>{children}</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
