"use client";

import { useEffect, useState } from "react";
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
  open?: boolean;
}

export function FilterSection({
  title,
  count = 0,
  children,
  open = false,
}: FilterSectionProps) {
  const [value, setValue] = useState<string[]>(() => (open ? ["item"] : []));

  useEffect(() => {
    setValue(open ? ["item"] : []);
  }, [open]);

  return (
    <Accordion value={value} onValueChange={setValue}>
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
