import React, { useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, ImagePlus, Sparkles, Wand2, Download, Trash2, Loader2, Camera } from "lucide-react";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function mockGenerateFromImage(_file: File, _opts: any) {
  // TODO: swap with your real API call
  await sleep(1200);
  return URL.createObjectURL(_file); // Echoes the uploaded image as a preview placeholder
}

async function mockGenerateFromText(_prompt: string, _opts: any) {
  // TODO: swap with your real API call – return a generated image URL
  await sleep(1200);
  // Placeholder: a data URL  transparent PNG (1x1). Replace with real output.
  return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=";
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
  const [tab, setTab] = useState<"img2img" | "txt2img">("img2img");
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // img2img
  const [file, setFile] = useState<File | null>(null);
  const [strength, setStrength] = useState(0.6);

  // txt2img
  const [prompt, setPrompt] = useState("");

  // shared - removed style, size, seed controls

  const fileInputRef = useRef<HTMLInputElement>(null);

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f && f.type.startsWith("image")) setFile(f);
  };

  const onBrowse = () => fileInputRef.current?.click();

  const removeResult = (idx: number) => setResults((r) => r.filter((_, i) => i !== idx));

  const commonOpts = useMemo(() => ({}), []);

  async function handleGenerate() {
    try {
      setLoading(true);
      let url = "";
      if (tab === "img2img") {
        if (!file) {
          alert("Please upload an image first.");
          return;
        }
        url = await mockGenerateFromImage(file, { ...commonOpts, strength });
      } else {
        if (!prompt.trim()) {
          alert("Please enter a prompt first.");
          return;
        }
        url = await mockGenerateFromText(prompt, { ...commonOpts });
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
          <h1 className="text-3xl font-extrabold tracking-tight">AdSnap Studio</h1>
          <div className="flex items-center gap-2 text-xs text-violet-300">
            <Sparkles className="h-4 w-4" /> Cartoon Generator
          </div>
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <TabBtn
            active={tab === "img2img"}
            onClick={() => setTab("img2img")}
            icon={<ImagePlus className="h-4 w-4" />}
            label="Image → Cartoon"
          />
          <TabBtn
            active={tab === "txt2img"}
            onClick={() => setTab("txt2img")}
            icon={<Wand2 className="h-4 w-4" />}
            label="Text → Cartoon"
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
              <h2 className="text-lg font-semibold">{tab === "img2img" ? "Image to Cartoon" : "Text to Cartoon"}</h2>
            </div>

            <AnimatePresence mode="wait">
              {tab === "img2img" ? (
                <motion.div
                  key="img2img"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="space-y-5"
                >
                  <Field label="Upload image (drag & drop supported)" right={<button onClick={onBrowse} className="text-xs text-pink-400 hover:underline">Browse</button>}>
                    <div
                      onDrop={onDrop}
                      onDragOver={(e) => e.preventDefault()}
                      className="group relative flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-zinc-700 bg-zinc-950/40 p-6 text-center hover:border-pink-600/60"
                      onClick={onBrowse}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                      />
                      {file ? (
                        <div className="flex w-full items-center gap-4">
                          <img src={URL.createObjectURL(file)} alt="preview" className="h-20 w-20 rounded-lg object-cover" />
                          <div className="text-left">
                            <p className="text-sm font-medium">{file.name}</p>
                            <p className="text-xs text-zinc-400">{Math.round(file.size / 1024)} KB</p>
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

                  <Field label="Cartoonize strength">
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.05}
                      value={strength}
                      onChange={(e) => setStrength(parseFloat(e.target.value))}
                      className="range w-full"
                    />
                    <div className="text-right text-xs text-zinc-400">{strength.toFixed(2)}</div>
                  </Field>
                </motion.div>
              ) : (
                <motion.div
                  key="txt2img"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="space-y-5"
                >
                  <Field label="Describe the cartoon you want">
                    <textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="e.g., a couple holding hands playing soccer in GWU colors, cute cartoon style"
                      className="min-h-[110px] w-full resize-y rounded-xl border border-zinc-700 bg-zinc-950/40 p-3 text-sm outline-none ring-pink-600/30 placeholder:text-zinc-500 focus:ring-2"
                    />
                  </Field>
                </motion.div>
              )}
            </AnimatePresence>


            <div className="mt-6 flex items-center justify-between gap-3">
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-2xl bg-pink-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-pink-600/30 transition hover:bg-pink-500 disabled:opacity-60"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                Generate
              </button>
              <div className="text-xs text-zinc-400">Outputs appear on the right →</div>
            </div>
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
        Built with ❤️ for creative ads & avatars.
      </footer>
    </div>
  );
}
