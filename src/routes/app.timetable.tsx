import { createFileRoute } from "@tanstack/react-router";
import { ContentBoard } from "@/components/ContentBoard";

export const Route = createFileRoute("/app/timetable")({
  component: () => <ContentBoard kind="timetable" title="Time Table" />,
});