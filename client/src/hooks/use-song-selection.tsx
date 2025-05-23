import { useState, useCallback } from "react";
import { CeremonyMoment } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

type SelectedMoments = { [key in CeremonyMoment]?: number } | null;

export default function useSongSelection() {
  const [selectedMoments, setSelectedMoments] = useState<SelectedMoments>({});
  const { toast } = useToast();

  // Add a song to a specific moment
  const selectSongForMoment = useCallback((songId: number, moment: CeremonyMoment) => {
    setSelectedMoments(prev => {
      // If song is already selected for this moment, remove it (toggle behavior)
      if (prev && prev[moment] === songId) {
        const updated = { ...prev };
        delete updated[moment];
        return updated;
      }
      
      // Check if this song is already used in another moment
      const existingMoment = prev && Object.entries(prev).find(([m, id]) => id === songId);
      if (existingMoment) {
        toast({
          title: "Song Already Selected",
          description: `This song is already selected for ${capitalizeFirstLetter(existingMoment[0] as CeremonyMoment)}. Each song can only be used once.`,
          variant: "destructive"
        });
        return prev;
      }
      
      // Add the song to the selected moment
      return {
        ...prev,
        [moment]: songId
      };
    });
  }, [toast]);

  // Remove a song from a moment
  const removeSongFromMoment = useCallback((moment: CeremonyMoment) => {
    setSelectedMoments(prev => {
      if (!prev) return prev;
      
      const updated = { ...prev };
      delete updated[moment];
      return updated;
    });
  }, []);

  // Reset all selections
  const resetSelections = useCallback(() => {
    if (Object.keys(selectedMoments || {}).length > 0) {
      if (window.confirm("Are you sure you want to reset all your song selections?")) {
        setSelectedMoments({});
        toast({
          title: "Selections Reset",
          description: "All your song selections have been cleared."
        });
      }
    } else {
      toast({
        title: "No Selections",
        description: "You don't have any songs selected yet."
      });
    }
  }, [selectedMoments, toast]);

  // Helper function to capitalize the first letter
  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return {
    selectedMoments,
    selectSongForMoment,
    removeSongFromMoment,
    resetSelections
  };
}
