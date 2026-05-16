import { createFileRoute } from "@tanstack/react-router";
import { ContentBoard } from "@/components/ContentBoard";

export const Route = createFileRoute("/app/updates")({
  component: () => <ContentBoard kind="updates" title="College Updates" />,
});