import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, ImagePlus, Sparkles, Download, Trash2, Camera } from "lucide-react";
import { pix2Pix, cyclicGANImage } from "./lib/api";

// Utility placeholder (unused) removed

async function generatePix2Pix(_file: File) {
  await pix2Pix(_file);
  return URL.createObjectURL(_file);
}

async function generateCyclicGANImage(_file: File) {
  await cyclicGANImage(_file);
  return URL.createObjectURL(_file);
}

// ------------------------ UI Controls ------------------------
const TabBtn: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }>
  = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`group inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
      active
        ? "bg-pink-600 text-white shadow-lg shadow-pink-600/30"
        : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white"
    }`}
  >
    <span className="opacity-90 group-hover:opacity-100">{icon}</span>
    {label}
  </button>
);

const Field: React.FC<{ label: string; children: React.ReactNode; right?: React.ReactNode }>
  = ({ label, children, right }) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between">
      <label className="text-sm text-zinc-300">{label}</label>
      {right}
    </div>
    {children}
  </div>
);

// ------------------------ Main Component ------------------------
export default function CartoonStudio() {
  const [tab, setTab] = useState<"pix_img2img" | "cyclic_img2img">("pix_img2img");
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Separate files per tab
  const [pixFile, setPixFile] = useState<File | null>(null);
  const [cyclicFile, setCyclicFile] = useState<File | null>(null);

  // shared - removed style, size, seed controls

  const pixFileInputRef = useRef<HTMLInputElement>(null);
  const cyclicFileInputRef = useRef<HTMLInputElement>(null);

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f && f.type.startsWith("image")) {
      if (tab === "pix_img2img") setPixFile(f);
      if (tab === "cyclic_img2img") setCyclicFile(f);
    }
  };

  const onBrowse = () => {
    if (tab === "pix_img2img") pixFileInputRef.current?.click();
    if (tab === "cyclic_img2img") cyclicFileInputRef.current?.click();
  };

  const clearPixFile = () => {
    setPixFile(null);
    if (pixFileInputRef.current) pixFileInputRef.current.value = "";
  };

  const clearCyclicFile = () => {
    setCyclicFile(null);
    if (cyclicFileInputRef.current) cyclicFileInputRef.current.value = "";
  };

  const removeResult = (idx: number) => setResults((r) => r.filter((_, i) => i !== idx));

  // No shared options currently

  async function handleGenerate() {
    try {
      setLoading(true);
      let url = "";
      if (tab === "pix_img2img") {
        if (!pixFile) {
          alert("Please upload an image first.");
          return;
        }
        url = await generatePix2Pix(pixFile);
      } else {
        if (!cyclicFile) {
          alert("Please upload an image first.");
          return;
        }
        url = await generateCyclicGANImage(cyclicFile);
      }
      setResults((r) => [url, ...r]);
    } catch (e) {
      console.error(e);
      alert("Generation failed. Check console for details.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full bg-zinc-950 text-zinc-100 py-6">
      <header className="mx-auto w-full max-w-7xl px-12 pt-12">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-3xl font-extrabold tracking-tight">Memo Studio</h1>
          <div className="flex items-center gap-2 text-xs text-violet-300">
            <Sparkles className="h-4 w-4" /> Cartoon Generator
          </div>
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <TabBtn
            active={tab === "pix_img2img"}
            onClick={() => setTab("pix_img2img")}
            icon={<ImagePlus className="h-4 w-4" />}
            label="Pix2Pix"
          />
          <TabBtn
            active={tab === "cyclic_img2img"}
            onClick={() => setTab("cyclic_img2img")}
            icon={<ImagePlus className="h-4 w-4" />}
            label="CyclicGAN"
          />
        </div>
      </header>

      <main className="mx-auto mt-12 w-full max-w-7xl px-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* LEFT: Controls */}
          <section className="lg:col-span-5">
          <motion.div
            layout
            className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-10 shadow-xl shadow-black/30 backdrop-blur"
          >
            <div className="mb-5">
              <h2 className="text-lg font-semibold">{tab === "pix_img2img" ? "Pix2Pix (img→img)" : "CyclicGAN (img→img)"}</h2>
            </div>

            <AnimatePresence mode="wait">
              {tab === "pix_img2img" ? (
                <motion.div
                  key="pix_img2img"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="space-y-5"
                >
                  <Field
                    label="Upload image (drag & drop supported)"
                    right={
                      <div className="flex items-center gap-3">
                        {pixFile && (
                          <button onClick={clearPixFile} className="text-xs text-zinc-400 hover:underline">Remove</button>
                        )}
                        <button onClick={onBrowse} className="text-xs text-pink-400 hover:underline">Browse</button>
                      </div>
                    }
                  >
                    <div
                      onDrop={onDrop}
                      onDragOver={(e) => e.preventDefault()}
                      className="group relative flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-zinc-700 bg-zinc-950/40 p-6 text-center hover:border-pink-600/60"
                      onClick={onBrowse}
                    >
                      <input
                        ref={pixFileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => setPixFile(e.target.files?.[0] ?? null)}
                      />
                      {pixFile ? (
                        <div className="flex w-full items-center gap-4">
                          <img src={URL.createObjectURL(pixFile)} alt="preview" className="h-20 w-20 rounded-lg object-cover" />
                          <div className="text-left">
                            <p className="text-sm font-medium">{pixFile.name}</p>
                            <p className="text-xs text-zinc-400">{Math.round(pixFile.size / 1024)} KB</p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-zinc-400">
                          <Upload className="h-6 w-6" />
                          <p className="text-sm">Drop an image here or click to upload</p>
                        </div>
                      )}
                    </div>
                  </Field>
                  <div className="pt-2">
                    <button
                      disabled={loading}
                      onClick={handleGenerate}
                      className="inline-flex items-center gap-2 rounded-xl bg-pink-600 px-4 py-2 text-sm font-semibold text-white hover:bg-pink-500 disabled:opacity-60"
                    >
                      Generate
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="cyclic_img2img"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="space-y-5"
                >
                  <Field
                    label="Upload image (drag & drop supported)"
                    right={
                      <div className="flex items-center gap-3">
                        {cyclicFile && (
                          <button onClick={clearCyclicFile} className="text-xs text-zinc-400 hover:underline">Remove</button>
                        )}
                        <button onClick={onBrowse} className="text-xs text-pink-400 hover:underline">Browse</button>
                      </div>
                    }
                  >
                    <div
                      onDrop={onDrop}
                      onDragOver={(e) => e.preventDefault()}
                      className="group relative flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-zinc-700 bg-zinc-950/40 p-6 text-center hover:border-pink-600/60"
                      onClick={onBrowse}
                    >
                      <input
                        ref={cyclicFileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => setCyclicFile(e.target.files?.[0] ?? null)}
                      />
                      {cyclicFile ? (
                        <div className="flex w-full items-center gap-4">
                          <img src={URL.createObjectURL(cyclicFile)} alt="preview" className="h-20 w-20 rounded-lg object-cover" />
                          <div className="text-left">
                            <p className="text-sm font-medium">{cyclicFile.name}</p>
                            <p className="text-xs text-zinc-400">{Math.round(cyclicFile.size / 1024)} KB</p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-zinc-400">
                          <Upload className="h-6 w-6" />
                          <p className="text-sm">Drop an image here or click to upload</p>
                        </div>
                      )}
                    </div>
                  </Field>
                  <div className="pt-2">
                    <button
                      disabled={loading}
                      onClick={handleGenerate}
                      className="inline-flex items-center gap-2 rounded-xl bg-pink-600 px-4 py-2 text-sm font-semibold text-white hover:bg-pink-500 disabled:opacity-60"
                    >
                      Generate
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
        </motion.div>
        </section>

          {/* RIGHT: Results Gallery */}
          <section className="lg:col-span-7">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-10">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Results</h3>
              <button
                onClick={() => setResults([])}
                className="inline-flex items-center gap-2 rounded-xl border border-zinc-800 px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800"
              >
                <Trash2 className="h-3.5 w-3.5" /> Clear all
              </button>
            </div>

            {results.length === 0 ? (
              <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-zinc-800 py-16 text-zinc-400">
                <Camera className="h-6 w-6" />
                <p className="text-sm">No images yet. Generate something magical ✨</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {results.map((src, i) => (
                  <motion.div
                    key={src + i}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="group relative overflow-hidden rounded-2xl border border-zinc-800 bg-black/30"
                  >
                    <img src={src} className="h-60 w-full object-cover" alt={`result-${i}`} />
                    <div className="absolute inset-x-0 bottom-0 flex translate-y-6 items-center justify-between gap-2 bg-gradient-to-t from-black/70 to-transparent p-3 opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100">
                      <a
                        href={src}
                        download={`cartoon-${i}.png`}
                        className="inline-flex items-center gap-1 rounded-lg bg-zinc-900/70 px-2.5 py-1.5 text-xs text-zinc-100 backdrop-blur hover:bg-zinc-800"
                      >
                        <Download className="h-3.5 w-3.5" /> Download
                      </a>
                      <button
                        onClick={() => removeResult(i)}
                        className="inline-flex items-center gap-1 rounded-lg bg-zinc-900/70 px-2.5 py-1.5 text-xs text-zinc-100 backdrop-blur hover:bg-zinc-800"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Remove
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          </section>
        </div>
      </main>

      <footer className="mx-auto my-12 w-full max-w-7xl px-12 text-center text-xs text-zinc-500">
        Built with ❤️ by the Memo Studio Team.
      </footer>
    </div>
  );
}
