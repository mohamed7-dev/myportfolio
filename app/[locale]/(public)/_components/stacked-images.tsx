"use client";
import {
  DndContext,
  PointerSensor,
  type DragEndEvent,
  useDraggable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import Link from "next/link";
import { useState } from "react";
import { AppImage } from "@/components/shared/app-image";
import type { GetFeaturedProjectsOutputSchema } from "@/lib/dto/visitor";

type FeaturedProject = GetFeaturedProjectsOutputSchema["items"][number];

function StackedProject({
  project,
  index,
  currentIndex,
  count,
}: {
  project: FeaturedProject;
  index: number;
  currentIndex: number;
  count: number;
}) {
  const relativeIndex = (index - currentIndex + count) % count;
  const isTop = relativeIndex === 0;
  const { listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: project.id,
    disabled: !isTop,
  });

  if (relativeIndex > 2) return null;

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      draggable={false}
      onDragStart={(event) => event.preventDefault()}
      className="absolute left-0 top-1/2 w-full aspect-video overflow-hidden rounded-base border-2 border-border"
      style={{
        zIndex: count - relativeIndex,
        transform: isTop
          ? `translate(${transform?.x ?? 0}px, -50%) rotate(${(transform?.x ?? 0) * 0.05}deg)`
          : `translateY(calc(-50% + ${relativeIndex * 20}px)) scale(${1 - relativeIndex * 0.05})`,
        transition: isDragging ? "none" : "transform 300ms ease",
        cursor: isTop ? (isDragging ? "grabbing" : "grab") : "default",
        touchAction: "pan-y",
      }}
    >
      <Link
        href={`/projects/${project.slug}`}
        aria-label={project.name}
        draggable={false}
        className="block size-full"
      >
        <AppImage
          asset={project.featuredAsset}
          transform={{ preset: "thumb", mode: "resize" }}
          draggable={false}
          className="size-full select-none object-cover"
        />
      </Link>
    </div>
  );
}

export function StackedImages({
  projects,
}: {
  projects: FeaturedProject[];
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
  );

  const handleDragEnd = ({ delta }: DragEndEvent) => {
    if (Math.abs(delta.x) < 40 || projects.length < 2) return;

    setCurrentIndex((index) =>
      (index + (delta.x < 0 ? 1 : projects.length - 1)) % projects.length,
    );
  };

  if (!projects.length) return null;

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="relative size-full">
        {projects.map((project, index) => (
          <StackedProject
            key={project.id}
            project={project}
            index={index}
            currentIndex={currentIndex}
            count={projects.length}
          />
        ))}
      </div>
    </DndContext>
  );
}
