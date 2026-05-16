import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export const Route = createFileRoute("/app/issues")({ component: IssuesPage });

interface Issue {
  id: string;
  title: string;
  body: string;
  author: string;
  role: string;
  createdAt: number;
}

const KEY = "mit.issues.v1";

function IssuesPage() {
  const auth = useAuth();
  const [items, setItems] = useState<Issue[]>([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  useEffect(() => {
    try { const raw = localStorage.getItem(KEY); if (raw) setItems(JSON.parse(raw)); } catch { /* noop */ }
  }, []);

  function save(next: Issue[]) {
    setItems(next);
    localStorage.setItem(KEY, JSON.stringify(next));
  }

  function post() {
    if (!auth) return;
    if (!title.trim() || !body.trim()) return toast.error("Title and description required.");
    const issue: Issue = {
      id: crypto.randomUUID(),
      title: title.trim(),
      body: body.trim(),
      author: auth.name,
      role: auth.role,
      createdAt: Date.now(),
    };
    save([issue, ...items]);
    setTitle(""); setBody("");
    toast.success("Issue posted.");
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Issues</h1>
        <p className="text-sm text-muted-foreground">Anyone can post problems. Admins will review.</p>
      </header>

      <Card>
        <CardHeader><CardTitle className="text-base">Post a new issue</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <Input placeholder="Short title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <Textarea placeholder="Describe the issue…" rows={4} value={body} onChange={(e) => setBody(e.target.value)} />
          <Button onClick={post}>Post issue</Button>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">No issues yet.</p>
        ) : items.map((i) => (
          <Card key={i.id}>
            <CardHeader className="pb-1">
              <CardTitle className="text-base flex items-center justify-between">
                <span>{i.title}</span>
                <Badge variant="secondary" className="capitalize">{i.role}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <p className="text-muted-foreground whitespace-pre-wrap">{i.body}</p>
              <p className="text-xs text-muted-foreground">{i.author} · {new Date(i.createdAt).toLocaleString()}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}