/*
Right now, when the user clicks on “Learn more” on any existing species, nothing happens.
Implement a dialog (”pop-up”) that opens when a user clicks “Learn more” and displays a detailed view of a species’ information.
Specifically, display the scientific_name, common_name, total_population, kingdom, and description.
You can omit information about the author for now; that will be an optional stretch goal later!
*/
"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { createBrowserSupabaseClient } from "@/lib/client-utils";
import type { Database } from "@/lib/schema";
import { useEffect, useState } from "react";

type Species = Database["public"]["Tables"]["species"]["Row"];

export default function LearnMore({ species }: { species: Species }) {
  const [open, setOpen] = useState<boolean>(false);

  const [authorName, setAuthorName] = useState<string | null>(null);

  const fetchAuthorName = async (input: Species) => {
    const supabase = createBrowserSupabaseClient();
    const { data } = await supabase.from("profiles").select("display_name").eq("id", input.author);

    if (data && data.length > 0) {
      setAuthorName(data[0]?.display_name ?? "Unknown");
    } else {
      setAuthorName("Unknown");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (open) {
        await fetchAuthorName(species);
      }
    };

    fetchData().catch((error) => {
      console.error("Error fetching author name:", error);
    });
  }, [open, species]);

  return (
    <Dialog open={open} onOpenChange={(open) => setOpen(open)}>
      <DialogTrigger asChild>
        <Button className="mt-3 w-full">Learn More</Button>
      </DialogTrigger>
      <DialogContent className="p-4">
        <h3 className="text-2xl font-semibold">{species.scientific_name}</h3>
        <h4 className="text-lg font-light italic">{species.common_name}</h4>
        <p>Total Population: {species.total_population}</p>
        <p>Kingdom: {species.kingdom}</p>
        <p>{species.description}</p>
        {species.endangered && <p>Endangered!</p>}
        <p>Author: {authorName ? authorName : "Loading..."}</p>
      </DialogContent>
    </Dialog>
  );
}
