import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import InspirationalSection from "@/components/InspirationalSection";
import SongGallery from "@/components/SongGallery";
import CeremonyTimeline from "@/components/CeremonyTimeline";
import SelectedSongsList from "@/components/SelectedSongsList";
import useSongSelection from "@/hooks/use-song-selection";
import { CeremonyMoment } from "@shared/schema";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const { selectedMoments, selectSongForMoment, removeSongFromMoment, resetSelections } = useSongSelection();
  const [activeMoment, setActiveMoment] = useState<CeremonyMoment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  // Handle click on a moment in the selections list
  const handleMomentClick = (moment: CeremonyMoment) => {
    setActiveMoment(moment);
    setIsModalOpen(true);
  };
  
  // Make the function available globally so SelectedSongsList can access it
  useEffect(() => {
    // Make the function globally accessible
    window.handleMomentSelect = handleMomentClick;
    
    return () => {
      // Clean up when component unmounts
      window.handleMomentSelect = undefined;
    };
  }, [handleMomentClick]);

  // Handle song selection from the modal
  const handleSelectForMoment = (songId: number, moment: CeremonyMoment) => {
    selectSongForMoment(songId, moment);
    setIsModalOpen(false); // Close the modal after selection
  };

  // Handle form submission with possible incomplete selections
  const handleIncompleteSubmit = (callback: () => void) => {
    // Check if all moments are selected
    const totalMoments = 9; // Total number of ceremony moments
    const selectedCount = Object.keys(selectedMoments || {}).length;
    
    if (selectedCount < totalMoments) {
      // Show confirmation dialog
      const missingCount = totalMoments - selectedCount;
      if (window.confirm(`You haven't selected songs for ${missingCount} moment(s). Are you sure you want to continue?`)) {
        callback();
      }
    } else {
      callback();
    }
  };

  // Helper function to show the selection filter
  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header onResetSelections={resetSelections} />
      
      <HeroSection />
      
      <main className="container mx-auto px-4 py-8 flex-grow">
        {/* Introduction and Instructions */}
        <div className="mb-10 max-w-3xl mx-auto text-center">
          <h3 className="font-display text-2xl font-semibold text-primary mb-4">
            Plan Your Wedding Music
          </h3>
          <p className="text-neutral-800 mb-6">
            Choose the perfect songs for each moment of your ceremony. Listen to previews, 
            view lyrics, and create a personalized music plan to share with your church choir.
          </p>
          
          {/* Timeline removed as requested */}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Song Selection Panel */}
          <div className="lg:col-span-2">
            <SongGallery 
              onSelectMoment={selectSongForMoment}
              selectedMoments={selectedMoments}
              initialFilterMoment={activeMoment}
            />
          </div>
          
          {/* Selected Songs Panel */}
          <div>
            <SelectedSongsList 
              selectedMoments={selectedMoments}
              onRemoveSong={removeSongFromMoment}
              onIncompleteSubmit={handleIncompleteSubmit}
              onMomentClick={handleMomentClick}
            />
          </div>
        </div>
      </main>
      
      <InspirationalSection />
      
      <Footer />

      {/* Modal for selecting songs for a specific moment */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Select a Song for {activeMoment && capitalizeFirstLetter(activeMoment)}
            </DialogTitle>
          </DialogHeader>
          
          {activeMoment && (
            <div className="mt-4">
              <SongGallery 
                onSelectMoment={handleSelectForMoment}
                selectedMoments={selectedMoments}
                initialFilterMoment={activeMoment}
                isModalMode={true} 
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
