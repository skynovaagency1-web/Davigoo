import { PLACES } from "@/lib/demo-data";
import { PHOTO_CREDITS, PLACE_PHOTOS } from "@/lib/place-photos";

// The pilot places as photo cards; a click picks the place as destination in the estimate form.
export function Places() {
  const pick = (id: string) => {
    window.dispatchEvent(new CustomEvent("mova:destination", { detail: id }));
    document.getElementById("devis")?.scrollIntoView({ behavior: "smooth", block: "center" });
  };
  return (
    <section id="lieux" aria-labelledby="lieux-title" className="container pt-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 id="lieux-title" className="font-display text-4xl sm:text-5xl">Où allez-vous ?</h2>
        <p className="max-w-sm text-sm text-muted-foreground">Les lieux du pilote à Besançon. Touchez une photo pour estimer le trajet.</p>
      </div>
      <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5 lg:gap-y-10">
        {PLACES.map((p, i) => (
          <li key={p.id}>
            <button
              type="button"
              onClick={() => pick(p.id)}
              className={`group relative block aspect-[4/5] w-full overflow-hidden rounded-[1.5rem] bg-[#d8c9b9] text-left shadow-[0_18px_40px_-22px_rgba(90,70,50,0.55)] ring-2 ring-white/60 transition hover:-translate-y-1 hover:ring-white ${i % 2 ? "lg:translate-y-6" : ""}`}
            >
              <img src={PLACE_PHOTOS[p.id]?.uri} alt={p.label} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" />
              <span className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#2c251d]/75" />
              <span className="absolute inset-x-4 bottom-4 font-display text-2xl leading-none text-white">{p.short}</span>
            </button>
          </li>
        ))}
      </ul>
      <p className="mt-10 text-[11px] text-muted-foreground lg:mt-12">{PHOTO_CREDITS}</p>
    </section>
  );
}
