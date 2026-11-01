import * as React from "react";
import { Loader2, MapPin } from "lucide-react";
import { PLACES, type Place } from "@/lib/demo-data";
import { searchAddress } from "@/lib/geo";
import { cn } from "@/lib/utils";

// Address field for the estimate: popular pilot places first, then live suggestions from the national address base.
export function AddressInput({ id, label, value, onChange }: { id: string; label: string; value: Place; onChange: (p: Place) => void }) {
  const [text, setText] = React.useState(value.label);
  const [open, setOpen] = React.useState(false);
  const [results, setResults] = React.useState<Place[]>([]);
  const [busy, setBusy] = React.useState(false);
  const [active, setActive] = React.useState(0);
  const box = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => setText(value.label), [value.id]);

  React.useEffect(() => {
    if (!open || text === value.label || text.trim().length < 3) return setResults([]);
    const ctrl = new AbortController();
    const t = setTimeout(() => {
      setBusy(true);
      searchAddress(text, ctrl.signal)
        .then(setResults)
        .catch(() => setResults([]))
        .finally(() => setBusy(false));
    }, 250);
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [text, open]);

  React.useEffect(() => {
    const close = (e: MouseEvent) => !box.current?.contains(e.target as Node) && setOpen(false);
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const typed = text !== value.label && text.trim().length >= 3;
  const options = typed ? results : PLACES;
  const pick = (p: Place) => {
    onChange(p);
    setText(p.label);
    setOpen(false);
  };

  return (
    <div ref={box} className="relative">
      <input
        id={id}
        role="combobox"
        aria-expanded={open}
        aria-controls={`${id}-list`}
        aria-label={label}
        autoComplete="off"
        value={text}
        placeholder="Adresse, gare, lieu…"
        onFocus={(e) => { setOpen(true); e.currentTarget.select(); }}
        onChange={(e) => { setText(e.target.value); setOpen(true); setActive(0); }}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, options.length - 1)); }
          if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
          if (e.key === "Enter" && open && options[active]) { e.preventDefault(); pick(options[active]); }
          if (e.key === "Escape") { setOpen(false); setText(value.label); }
        }}
        onBlur={() => setTimeout(() => !box.current?.contains(document.activeElement) && setText((t) => (t === "" ? value.label : t)), 0)}
        className="w-full truncate bg-transparent py-1 pr-6 text-base font-semibold text-foreground placeholder:font-normal placeholder:text-muted-foreground/70 focus:outline-none"
      />
      {busy && <Loader2 className="absolute right-0 top-2 size-4 animate-spin text-muted-foreground" />}
      {open && options.length > 0 && (
        <ul id={`${id}-list`} role="listbox" className="glass-card absolute left-0 right-0 top-full z-30 mt-2 max-h-72 overflow-y-auto rounded-2xl !bg-[#fbf8f5]/95 py-1.5">
          {!typed && <li className="px-4 pb-1 pt-1.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Lieux populaires</li>}
          {options.map((p, i) => (
            <li key={p.id + i} role="option" aria-selected={i === active}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => pick(p)}
                onMouseEnter={() => setActive(i)}
                className={cn("flex w-full items-start gap-2.5 px-4 py-2 text-left", i === active && "bg-[#d8c1a8]/30")}
              >
                <MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium">{p.short}</span>
                  <span className="block truncate text-xs text-muted-foreground">{p.label}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
