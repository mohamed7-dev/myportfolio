"use client";
import { XIcon } from "lucide-react";
import React from "react";
import { useFormContext } from "react-hook-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { UpdateAssetInputSchema } from "@/lib/dto/asset";

export function TagsField() {
  const [value, setValue] = React.useState("");

  const form = useFormContext<UpdateAssetInputSchema>();

  const tags = form.getValues("tags") ?? [];

  const addTag = (value: string) => {
    if (!value || tags.some((t) => t === value)) {
      return;
    }
    form.setValue("tags", [...(form.getValues("tags") ?? []), value]);
    setValue("");
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      addTag(value);
    }
  };

  const remove = (value: string) => {
    const filtered = form.getValues("tags")?.filter((t) => t !== value);
    form.setValue("tags", [...(filtered ?? [])]);
  };

  return (
    <div className="space-y-3">
      <div className="flex min-h-10 flex-wrap gap-2 rounded-base border-2 border-border p-2">
        {tags.length > 0 ? (
          tags.map((tag) => (
            <Badge
              key={tag}
              variant={"neutral"}
              className="flex items-center gap-1 px-2 py-1 text-sm"
            >
              <span>{tag}</span>
              <Button
                size={"icon-sm"}
                variant={"neutralNoShadow"}
                onClick={() => remove(tag)}
                aria-label={`Remove tag ${tag}`}
              >
                <XIcon className="size-3.5" />
              </Button>
            </Badge>
          ))
        ) : (
          <span className="px-1 text-sm text-foreground/80">No tags added</span>
        )}
      </div>

      <div className="flex gap-2">
        <Input
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={(e) => handleKeyDown(e)}
          placeholder="Add a tag..."
        />

        <Button
          size={"icon"}
          variant={"noShadow"}
          onClick={() => addTag(value)}
          disabled={!value.trim()}
        >
          Add
        </Button>
      </div>
    </div>
  );
}
