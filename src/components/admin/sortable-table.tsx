"use client";

import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  restrictToParentElement,
  restrictToVerticalAxis,
} from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

function SortableRow({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  return (
    <TableRow
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(isDragging && "relative z-10 bg-paper-2 shadow-sm")}
    >
      <TableCell className="w-8 pr-0">
        <button
          type="button"
          aria-label="Reorder row"
          className="flex min-h-6 cursor-grab touch-none items-center text-muted-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="size-4" />
        </button>
      </TableCell>
      {children}
    </TableRow>
  );
}

/** Table whose rows reorder by drag (pointer + keyboard). `onReorder`
 * receives the full re-ordered array; persist sort_order = index there. */
export function SortableTable<T extends { id: string }>({
  items,
  onReorder,
  head,
  renderRow,
}: {
  items: T[];
  onReorder: (items: T[]) => void;
  /** TableHead cells, excluding the drag-handle column. */
  head: React.ReactNode;
  /** TableCells for one row, excluding the drag-handle cell. */
  renderRow: (item: T) => React.ReactNode;
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;
    const oldIndex = items.findIndex((i) => i.id === active.id);
    const newIndex = items.findIndex((i) => i.id === over.id);
    onReorder(arrayMove(items, oldIndex, newIndex));
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      modifiers={[restrictToVerticalAxis, restrictToParentElement]}
      onDragEnd={handleDragEnd}
    >
      <Table className="mt-4">
        <TableHeader>
          <TableRow>
            <TableHead className="w-8" />
            {head}
          </TableRow>
        </TableHeader>
        <SortableContext
          items={items.map((i) => i.id)}
          strategy={verticalListSortingStrategy}
        >
          <TableBody>
            {items.map((item) => (
              <SortableRow key={item.id} id={item.id}>
                {renderRow(item)}
              </SortableRow>
            ))}
          </TableBody>
        </SortableContext>
      </Table>
    </DndContext>
  );
}
