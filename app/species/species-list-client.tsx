// components/species-list-client.tsx
"use client";

import type { Database } from "@/lib/schema";
import { useState } from "react";
import SpeciesCard from "./species-card";

type Species = Database["public"]["Tables"]["species"]["Row"];

export default function SpeciesListClient({ species }: { species: Species[] }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredSpecies = species.filter(
    (species) =>
      species.scientific_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      species.common_name?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <>
      <input
        type="text"
        placeholder="Search species"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 rounded border p-2"
      />

      <div className="flex flex-wrap justify-center">
        {filteredSpecies.length > 0 ? (
          filteredSpecies.map((species) => <SpeciesCard key={species.id} species={species} />)
        ) : (
          <p>No species found.</p>
        )}
      </div>
    </>
  );
}
