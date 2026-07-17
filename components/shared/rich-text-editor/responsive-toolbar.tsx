import type { Editor } from "@tiptap/react";
import {
  BoldIcon,
  ItalicIcon,
  ListIcon,
  ListOrderedIcon,
  MoreHorizontalIcon,
  QuoteIcon,
  Redo2Icon,
  StrikethroughIcon,
  Undo2Icon,
} from "lucide-react";
import React from "react";
import { Button } from "../../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";

interface ToolbarItem {
  id: string;
  priority: number;
  element: React.ReactNode;
  action?: () => void;
  label: string;
  isActive?: boolean;
}

export interface ResponsiveToolbarProps {
  editor: Editor | null;
  disabled?: boolean;
}

export function ResponsiveToolbar({
  editor,
  disabled,
}: ResponsiveToolbarProps) {
  const [visibleItems, setVisibleItems] = React.useState<string[]>([]);
  const [overflowItems, setOverflowItems] = React.useState<string[]>([]);
  const toolbarRef = React.useRef<HTMLDivElement>(null);

  const getCurrentHeading = React.useCallback(() => {
    if (!editor) return "paragraph";
    for (let level = 1; level <= 6; level++) {
      if (editor.isActive("heading", { level })) return `h${level}`;
    }
    return "paragraph";
  }, [editor]);

  const handleHeadingChange = React.useCallback(
    (value: string) => {
      if (!editor) return;
      if (value === "paragraph") {
        editor.chain().focus().setParagraph().run();
      } else {
        const level = Number.parseInt(value.replace("h", ""), 10) as
          | 1
          | 2
          | 3
          | 4
          | 5
          | 6;
        editor.chain().focus().toggleHeading({ level }).run();
      }
    },
    [editor],
  );

  const headingOptions = React.useMemo(
    () => [
      { value: "paragraph", label: "Normal" },
      { value: "h1", label: "Heading 1" },
      { value: "h2", label: "Heading 2" },
      { value: "h3", label: "Heading 3" },
      { value: "h4", label: "Heading 4" },
      { value: "h5", label: "Heading 5" },
      { value: "h6", label: "Heading 6" },
    ],
    [],
  );

  const canUndo = !!editor?.can().undo();
  const canRedo = !!editor?.can().redo();

  const toolbarItems: ToolbarItem[] = React.useMemo(() => {
    if (!editor) return [];

    return [
      {
        id: "bold",
        priority: 1,
        label: "Bold",
        isActive: editor.isActive("bold"),
        action: () => editor.chain().focus().toggleBold().run(),
        element: (
          <Button
            key="bold"
            type="button"
            variant="neutralNoShadow"
            size="sm"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`h-8 px-2 ${editor.isActive("bold") ? "bg-primary" : ""}`}
            disabled={disabled}
          >
            <BoldIcon className="h-4 w-4" />
          </Button>
        ),
      },
      {
        id: "italic",
        priority: 2,
        label: "Italic",
        isActive: editor.isActive("italic"),
        action: () => editor.chain().focus().toggleItalic().run(),
        element: (
          <Button
            key="italic"
            type="button"
            variant="neutralNoShadow"
            size="sm"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`h-8 px-2 ${editor.isActive("italic") ? "bg-primary" : ""}`}
            disabled={disabled}
          >
            <ItalicIcon className="h-4 w-4" />
          </Button>
        ),
      },
      {
        id: "strike",
        priority: 3,
        label: "Strikethrough",
        isActive: editor.isActive("strike"),
        action: () => editor.chain().focus().toggleStrike().run(),
        element: (
          <Button
            key="strike"
            type="button"
            variant="neutralNoShadow"
            size="sm"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`h-8 px-2 ${editor.isActive("strike") ? "bg-primary" : ""}`}
            disabled={disabled}
          >
            <StrikethroughIcon className="h-4 w-4" />
          </Button>
        ),
      },
      {
        id: "bulletList",
        priority: 4,
        label: "Bullet List",
        isActive: editor.isActive("bulletList"),
        action: () => editor.chain().focus().toggleBulletList().run(),
        element: (
          <Button
            key="bulletList"
            type="button"
            variant="neutralNoShadow"
            size="sm"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`h-8 px-2 ${editor.isActive("bulletList") ? "bg-primary" : ""}`}
            disabled={disabled}
          >
            <ListIcon className="h-4 w-4" />
          </Button>
        ),
      },
      {
        id: "orderedList",
        priority: 5,
        label: "Ordered List",
        isActive: editor.isActive("orderedList"),
        action: () => editor.chain().focus().toggleOrderedList().run(),
        element: (
          <Button
            key="orderedList"
            type="button"
            variant="neutralNoShadow"
            size="sm"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`h-8 px-2 ${editor.isActive("orderedList") ? "bg-primary" : ""}`}
            disabled={disabled}
          >
            <ListOrderedIcon className="h-4 w-4" />
          </Button>
        ),
      },
      {
        id: "blockquote",
        priority: 8,
        label: "Blockquote",
        isActive: editor.isActive("blockquote"),
        action: () => editor.chain().focus().toggleBlockquote().run(),
        element: (
          <Button
            key="blockquote"
            type="button"
            variant="neutralNoShadow"
            size="sm"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`h-8 px-2 ${editor.isActive("blockquote") ? "bg-primary" : ""}`}
            disabled={disabled}
          >
            <QuoteIcon className="h-4 w-4" />
          </Button>
        ),
      },
      {
        id: "undo",
        priority: 10,
        label: "Undo",
        action: () => editor.chain().focus().undo().run(),
        element: (
          <Button
            key="undo"
            type="button"
            variant="neutralNoShadow"
            size="sm"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={disabled || !canUndo}
            className="h-8 px-2"
          >
            <Undo2Icon className="h-4 w-4" />
          </Button>
        ),
      },
      {
        id: "redo",
        priority: 11,
        label: "Redo",
        action: () => editor.chain().focus().redo().run(),
        element: (
          <Button
            key="redo"
            type="button"
            variant="neutralNoShadow"
            size="sm"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={disabled || !canRedo}
            className="h-8 px-2"
          >
            <Redo2Icon className="h-4 w-4" />
          </Button>
        ),
      },
    ];
  }, [editor, disabled, canUndo, canRedo]);

  React.useEffect(() => {
    const calculateVisibleItems = () => {
      if (!toolbarRef.current) return;

      const toolbar = toolbarRef.current;
      const toolbarWidth = toolbar.clientWidth;
      const headingSelectWidth = 130; // Fixed width for heading select
      const overflowButtonWidth = 40; // Width for overflow button
      const padding = 16; // Toolbar padding

      const usedWidth = headingSelectWidth + padding;
      const visible: string[] = [];
      const overflow: string[] = [];

      // Always show heading select, so start with remaining width
      let remainingWidth = toolbarWidth - usedWidth;

      // Sort items by priority (lower number = higher priority)
      const sortedItems = [...toolbarItems].sort(
        (a, b) => a.priority - b.priority,
      );

      for (const item of sortedItems) {
        const itemWidth = 40; // Approximate button width

        if (
          remainingWidth >=
          itemWidth + (overflow.length === 0 ? 0 : overflowButtonWidth)
        ) {
          visible.push(item.id);
          remainingWidth -= itemWidth;
        } else {
          overflow.push(item.id);
        }
      }

      setVisibleItems(visible);
      setOverflowItems(overflow);
    };

    calculateVisibleItems();

    const resizeObserver = new ResizeObserver(calculateVisibleItems);
    if (toolbarRef.current) {
      resizeObserver.observe(toolbarRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [toolbarItems]);

  const visibleElements = toolbarItems
    .filter((item) => visibleItems.includes(item.id))
    .sort((a, b) => a.priority - b.priority)
    .map((item) => item.element);

  const overflowElements = toolbarItems.filter((item) =>
    overflowItems.includes(item.id),
  );

  if (!editor) return null;

  return (
    <div
      ref={toolbarRef}
      className="flex items-center gap-1 p-2 border-b-2 border-border bg-background"
    >
      <Select
        value={getCurrentHeading()}
        onValueChange={(value) => value != null && handleHeadingChange(value)}
        disabled={disabled}
      >
        <SelectTrigger size="sm" className="w-32.5 py-1">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {headingOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {visibleElements}

      {overflowElements.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="noShadow"
              size="sm"
              className="h-8 px-2"
              disabled={disabled}
            >
              <MoreHorizontalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {overflowElements.map((item) => (
              <div key={item.id}>
                <DropdownMenuItem
                  onClick={item.action}
                  disabled={disabled}
                  className={item.isActive ? "bg-primary" : ""}
                >
                  {item.label}
                </DropdownMenuItem>
              </div>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
