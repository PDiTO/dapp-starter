"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";

export default function Counter() {
  const [count, setCount] = useState(0);

  const increment = () => setCount(prev => prev + 1);
  const decrement = () => setCount(prev => prev - 1);

  return (
    <div className="flex items-center gap-4">
      <Button 
        onClick={decrement}
        size="icon"
        variant="outline"
      >
        <Minus className="h-4 w-4" />
      </Button>
      
      <div className="text-2xl font-semibold min-w-[3rem] text-center">
        {count}
      </div>
      
      <Button 
        onClick={increment}
        size="icon"
        variant="outline"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}