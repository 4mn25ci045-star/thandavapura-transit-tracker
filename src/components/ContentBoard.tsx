import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/lib/auth-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, FileText, Image as ImageIcon, Lock } from "lucide-react";
import { toast } from "sonner";

export interface ContentItem {
  id: string;
  kind: string; // updates | calendars | timetable | exams
  year: 1 | 2 | 3 | 4;
  branch: string;
  title: string;
  description?: string;
  fileName?: string;
  fileType?: string;
  createdAt: number;
  createdBy: string;
}

const BRANCHES = ["CS", "IS", "EC", "ME", "CV", "AI"];
const YEARS: (1 | 2 | 3 | 4)[] = [1, 2, 3, 4];

export function ContentBoard({ kind, title }: { kind: string; title: string }) {
  const auth = useAuth();
  const storageKey = `mit.content.${kind}.v1`;
  const [items, setItems] = useState<ContentItem[]>([]);
  const [year, setYear] = useState<1 | 2 | 3 | 4>(auth?.year ?? 1);
  const [branch, setBranch] = useState<string>(auth?.branch ?? "CS");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) setItems(JSON.parse(raw));
    } catch { /* noop */ }
  }, [storageKey]);

  function persist(next: ContentItem[]) {
    setItems(next);
    localStorage.setItem(storageKey, JSON.stringify(next));
  }

  const canManage = auth?.role === "admin" || auth?.role === "owner";
  const filtered = useMemo(
    () => items.filter((i) => i.year === year && i.branch === branch).sort((a, b) => b.createdAt - a.createdAt),
    [items, year, branch],
  );

  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold">{title}</h1>
          <p className="text-sm text-muted-foreground">
            {canManage ? "Upload and manage content by year and branch." : "Showing content for your year and branch."}
          </p>
        </div>
        {canManage && (
          <UploadDialog
            onCreate={(item) => {
              persist([{ ...item, kind, createdBy: auth!.name, createdAt: Date.now(), id: crypto.randomUUID() }, ...items]);
              toast.success("Content uploaded.");
            }}
            defaultYear={year}
            defaultBranch={branch}
          />
        )}
      </header>

      <div className="flex gap-2 flex-wrap">
        <div className="space-y-1">
          <Label className="text-xs">Year</Label>
          <Select value={String(year)} onValueChange={(v) => setYear(Number(v) as 1 | 2 | 3 | 4)}>
            <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              {YEARS.map((y) => <SelectItem key={y} value={String(y)}>Year {y}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Branch</Label>
          <Select value={branch} onValueChange={setBranch}>
            <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              {BRANCHES.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            <Lock className="size-6 mx-auto mb-2 opacity-50" />
            No {title.toLowerCase()} yet for Year {year} · {branch}.
            {canManage && <div className="mt-2">Click the + button to upload.</div>}
          </CardContent>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((i) => (
            <Card key={i.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  {i.fileType?.startsWith("image/") ? <ImageIcon className="size-4" /> : <FileText className="size-4" />}
                  {i.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                {i.description && <p className="text-muted-foreground">{i.description}</p>}
                <div className="flex items-center gap-2 text-xs">
                  <Badge variant="secondary">Year {i.year}</Badge>
                  <Badge variant="secondary">{i.branch}</Badge>
                  {i.fileName && <span className="text-muted-foreground truncate">{i.fileName}</span>}
                </div>
                <div className="text-xs text-muted-foreground">By {i.createdBy} · {new Date(i.createdAt).toLocaleDateString()}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function UploadDialog({
  onCreate,
  defaultYear,
  defaultBranch,
}: {
  onCreate: (i: Omit<ContentItem, "id" | "createdAt" | "createdBy" | "kind">) => void;
  defaultYear: 1 | 2 | 3 | 4;
  defaultBranch: string;
}) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [year, setYear] = useState<1 | 2 | 3 | 4>(defaultYear);
  const [branch, setBranch] = useState(defaultBranch);
  const [file, setFile] = useState<File | null>(null);

  function submit() {
    if (!title.trim()) return toast.error("Title required.");
    onCreate({
      year,
      branch,
      title: title.trim(),
      description: description.trim() || undefined,
      fileName: file?.name,
      fileType: file?.type,
    });
    setOpen(false);
    setTitle(""); setDescription(""); setFile(null);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button><Plus className="size-4 mr-2" /> Upload</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Upload content</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1"><Label>Title</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} /></div>
          <div className="space-y-1"><Label>Description (optional)</Label><Input value={description} onChange={(e) => setDescription(e.target.value)} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>Year</Label>
              <Select value={String(year)} onValueChange={(v) => setYear(Number(v) as 1 | 2 | 3 | 4)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{YEARS.map((y) => <SelectItem key={y} value={String(y)}>Year {y}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Branch</Label>
              <Select value={branch} onValueChange={setBranch}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{BRANCHES.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1">
            <Label>File (PDF, image, doc)</Label>
            <Input type="file" accept=".pdf,image/*,.doc,.docx" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
          </div>
          <Button className="w-full" onClick={submit}>Publish</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}