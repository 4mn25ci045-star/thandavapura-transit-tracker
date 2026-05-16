import { createFileRoute } from "@tanstack/react-router";
import { ContentBoard } from "@/components/ContentBoard";

export const Route = createFileRoute("/app/calendars")({
  component: () => <ContentBoard kind="calendars" title="Calendars" />,
});