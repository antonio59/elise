import React, { useRef, useState } from "react";
import { useMutation } from "convex/react";
import { BookUp2, FileUp, Loader2 } from "lucide-react";
import ModalShell from "../ModalShell";
import { Button } from "../ui/Button";
import { api } from "../../../convex/_generated/api";
import {
  parseGoodreadsCsv,
  type GoodreadsImportRow,
} from "../../lib/goodreads";

const BATCH_SIZE = 50;

interface ImportGoodreadsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDone?: () => void;
}

type Stage =
  | { step: "pick" }
  | { step: "preview"; rows: GoodreadsImportRow[]; skipped: number }
  | { step: "importing"; done: number; total: number }
  | { step: "done"; imported: number; skipped: number };

const ImportGoodreadsModal: React.FC<ImportGoodreadsModalProps> = ({
  isOpen,
  onClose,
  onDone,
}) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const importBooks = useMutation(api.goodreads.importBooks);
  const [stage, setStage] = useState<Stage>({ step: "pick" });
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setStage({ step: "pick" });
    setError(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    try {
      const text = await file.text();
      const { rows, skipped } = parseGoodreadsCsv(text);
      if (rows.length === 0) {
        setError("No books found in that file.");
        return;
      }
      setStage({ step: "preview", rows, skipped });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't read that file.");
    }
  };

  const handleImport = async (rows: GoodreadsImportRow[]) => {
    setStage({ step: "importing", done: 0, total: rows.length });
    let imported = 0;
    let skipped = 0;
    try {
      for (let i = 0; i < rows.length; i += BATCH_SIZE) {
        const batch = rows.slice(i, i + BATCH_SIZE).map((b) => ({
          ...b,
          coverUrl: b.isbn
            ? `https://covers.openlibrary.org/b/isbn/${b.isbn}-L.jpg`
            : undefined,
        }));
        const result = await importBooks({ books: batch });
        imported += result.imported;
        skipped += result.skipped;
        setStage({
          step: "importing",
          done: Math.min(i + BATCH_SIZE, rows.length),
          total: rows.length,
        });
      }
      setStage({ step: "done", imported, skipped });
      onDone?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Import failed.");
      setStage({ step: "preview", rows, skipped: 0 });
    }
  };

  return (
    <ModalShell
      isOpen={isOpen}
      title="Import from Goodreads"
      closeLabel="Close import modal"
      onClose={handleClose}
      maxWidth="max-w-lg"
      titleId="goodreads-import-title"
    >
      <div className="p-6 space-y-4">
        {stage.step === "pick" && (
          <>
            <p className="text-sm text-slate-600">
              Export your Goodreads library first: Goodreads → My Books →
              Import/Export → <strong>Export Library</strong>, then upload the
              CSV here. Your ratings, reviews, and shelves come along too.
            </p>
            <input
              ref={fileRef}
              type="file"
              accept=".csv,text/csv"
              onChange={handleFile}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="w-full h-40 border-2 border-dashed border-slate-300 hover:border-primary-400 rounded-xl flex flex-col items-center justify-center gap-2 transition-colors"
            >
              <FileUp className="w-10 h-10 text-slate-400" />
              <span className="text-slate-600 font-medium">
                Choose your Goodreads CSV
              </span>
              <span className="text-xs text-slate-400">goodreads_library_export.csv</span>
            </button>
            {error && (
              <p className="text-sm text-error-500" role="alert">
                {error}
              </p>
            )}
          </>
        )}

        {stage.step === "preview" && (
          <>
            <p className="text-sm text-slate-600">
              Found <strong>{stage.rows.length}</strong> books
              {stage.skipped > 0 && ` (${stage.skipped} unreadable rows skipped)`}
              :
            </p>
            <div className="grid grid-cols-3 gap-3 text-center">
              {(
                [
                  ["Read", stage.rows.filter((r) => r.status === "read").length],
                  [
                    "Reading",
                    stage.rows.filter((r) => r.status === "reading").length,
                  ],
                  [
                    "Wishlist",
                    stage.rows.filter((r) => r.status === "wishlist").length,
                  ],
                ] as const
              ).map(([label, count]) => (
                <div key={label} className="card p-3">
                  <div className="text-xl font-bold font-display text-primary-600">
                    {count}
                  </div>
                  <div className="text-xs text-slate-500">{label}</div>
                </div>
              ))}
            </div>
            <div className="max-h-40 overflow-y-auto rounded-xl border border-slate-200 divide-y divide-slate-100">
              {stage.rows.slice(0, 8).map((r, i) => (
                <div key={i} className="px-3 py-2 text-sm">
                  <span className="font-medium text-slate-800">{r.title}</span>
                  <span className="text-slate-400"> — {r.author}</span>
                </div>
              ))}
              {stage.rows.length > 8 && (
                <div className="px-3 py-2 text-xs text-slate-400">
                  …and {stage.rows.length - 8} more
                </div>
              )}
            </div>
            {error && (
              <p className="text-sm text-error-500" role="alert">
                {error}
              </p>
            )}
            <div className="flex gap-3">
              <Button variant="secondary" className="flex-1" onClick={reset}>
                Pick another file
              </Button>
              <Button
                className="flex-1"
                icon={<BookUp2 className="w-4 h-4" />}
                onClick={() => handleImport(stage.rows)}
              >
                Import {stage.rows.length} books
              </Button>
            </div>
          </>
        )}

        {stage.step === "importing" && (
          <div className="py-8 text-center space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-primary-500 mx-auto" />
            <p className="text-sm text-slate-600">
              Importing… {stage.done} of {stage.total}
            </p>
            <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full bg-primary-500 transition-all"
                style={{ width: `${(stage.done / stage.total) * 100}%` }}
              />
            </div>
          </div>
        )}

        {stage.step === "done" && (
          <div className="py-6 text-center space-y-3">
            <p className="text-lg font-display font-bold text-slate-800">
              All done!
            </p>
            <p className="text-sm text-slate-600">
              Imported <strong>{stage.imported}</strong> books
              {stage.skipped > 0 &&
                ` · ${stage.skipped} already on your shelf (skipped)`}
              .
            </p>
            <p className="text-xs text-slate-400">
              Covers fill in automatically over the next minute or two.
            </p>
            <Button className="w-full" onClick={handleClose}>
              Done
            </Button>
          </div>
        )}
      </div>
    </ModalShell>
  );
};

export default ImportGoodreadsModal;
