import { Search } from "lucide-react";

export function SearchPanel({ compact = false }: { compact?: boolean }) {
  return (
    <form className="grid gap-3 rounded-lg border border-stone-200 bg-white p-4 shadow-sm sm:grid-cols-[1fr_auto_auto]">
      <label className="sr-only" htmlFor="location-search">
        Postal code or city
      </label>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" size={18} aria-hidden="true" />
        <input
          id="location-search"
          name="location"
          placeholder="Enter postal code or city"
          defaultValue="Mississauga, ON"
          className="w-full rounded-md border border-stone-300 py-3 pl-10 pr-3 text-ink outline-none focus:border-moss focus:ring-2 focus:ring-moss/20"
        />
      </div>
      <select aria-label="Preferred radius" name="radius" className="rounded-md border border-stone-300 px-3 py-3 text-ink outline-none focus:border-moss focus:ring-2 focus:ring-moss/20">
        <option>Within 5 km</option>
        <option>Within 10 km</option>
        <option>Within 25 km</option>
      </select>
      <button className="rounded-md bg-ink px-5 py-3 font-semibold text-white hover:bg-stone-800" type="submit">
        {compact ? "Search" : "Find ways to help"}
      </button>
    </form>
  );
}
