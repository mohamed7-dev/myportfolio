import { SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";

interface ActionsBarProps {
  searchInput: string;
  onSearchInputChange: (value: string) => void;
}

export function ActionsBar({
  searchInput,
  onSearchInputChange,
}: ActionsBarProps) {
  return (
    <div className="flex flex-col md:flex-row gap-2">
      <div className="flex-1 flex items-center gap-2 relative">
        <SearchIcon className="size-4 absolute left-2 top-3" />
        <Input
          placeholder={"Search assets"}
          value={searchInput}
          onChange={(e) => onSearchInputChange(e.target.value)}
          className="ps-8"
        />
      </div>
    </div>
  );
}
