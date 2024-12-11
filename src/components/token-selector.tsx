"use client";

import { Award, Check, ChevronsUpDown, CircleDollarSign } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { addressSplitter, cn } from "@/lib/utils";
import { isAddress } from "viem";

export default function TokenSelector({
  tokens,
  badges,
  value,
  onChange,
}: {
  tokens: Token[];
  badges: Badge[];
  value: string;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");

  const handleSelect = (currentValue: string) => {
    onChange(currentValue === value ? "" : currentValue);
    setOpen(false);
  };

  const handleCustomInput = (input: string) => {
    if (isAddress(input)) {
      onChange(input.toLowerCase());
      setOpen(false);
    }
  };

  const getDisplayValue = () => {
    const selectedItem = [...tokens, ...badges].find((item) => item.id === value);
    if (selectedItem) {
      return `${selectedItem.name} (${selectedItem.id})`;
    }
    if (isAddress(value)) {
      return value;
    }
    return "Search or enter token address...";
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="justify-between flex-1">
          {getDisplayValue()}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <Command>
          <CommandInput
            placeholder="Search or enter token address..."
            value={inputValue}
            onValueChange={(value) => {
              setInputValue(value);
              handleCustomInput(value);
            }}
          />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Tokens">
              {tokens.map((item) => (
                <CommandItem key={item.id} value={item.name} onSelect={() => handleSelect(item.id)}>
                  <CircleDollarSign className={cn("mr-2 h-4 w-4", value === item.id ? "opacity-100" : "opacity-40")} />
                  {`${item.name} (${addressSplitter(item.id, 4)})`}
                  <Check className={cn("ml-auto h-4 w-4", value === item.id ? "opacity-100" : "opacity-0")} />
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
            {badges.length > 0 && (
              <CommandGroup heading="Badges">
                {badges.map((item) => (
                  <CommandItem key={item.id} value={item.name} onSelect={() => handleSelect(item.id)}>
                    <Award className={cn("mr-2 h-4 w-4", value === item.id ? "opacity-100" : "opacity-40")} />
                    {item.name}
                    <Check className={cn("ml-auto h-4 w-4", value === item.id ? "opacity-100" : "opacity-0")} />
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
