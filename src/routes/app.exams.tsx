import { createFileRoute } from "@tanstack/react-router";
import { ContentBoard } from "@/components/ContentBoard";

export const Route = createFileRoute("/app/exams")({
  component: () => <ContentBoard kind="exams" title="Exam Time Table" />,
});