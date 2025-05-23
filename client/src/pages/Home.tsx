import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import InspirationalSection from "@/components/InspirationalSection";
import SongGallery from "@/components/SongGallery";
import CeremonyTimeline from "@/components/CeremonyTimeline";
import SelectedSongsList from "@/components/SelectedSongsList";
import useSongSelection from "@/hooks/use-song-selection";

export default function Home() {
  const { selectedMoments, selectSongForMoment, removeSongFromMoment, resetSelections } = useSongSelection();

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
          
          {/* Timeline visualization of ceremony moments */}
          <CeremonyTimeline selectedMoments={selectedMoments} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Song Selection Panel */}
          <div className="lg:col-span-2">
            <SongGallery 
              onSelectMoment={selectSongForMoment}
              selectedMoments={selectedMoments}
            />
          </div>
          
          {/* Selected Songs Panel */}
          <div>
            <SelectedSongsList 
              selectedMoments={selectedMoments}
              onRemoveSong={removeSongFromMoment}
            />
          </div>
        </div>
      </main>
      
      <InspirationalSection />
      
      <Footer />
    </div>
  );
}
