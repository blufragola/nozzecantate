import React, { useMemo } from "react";
import { Song, CeremonyMoment } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import ShareOptionsForm from "./ShareOptionsForm";
import { generatePdf } from "@/lib/pdf-generator";

interface SelectedSongsListProps {
  selectedMoments: { [key in CeremonyMoment]?: number } | null;
  onRemoveSong: (moment: CeremonyMoment) => void;
  onIncompleteSubmit?: (callback: () => void) => void;
}

export default function SelectedSongsList({ 
  selectedMoments, 
  onRemoveSong,
  onIncompleteSubmit 
}: SelectedSongsListProps) {
  const { toast } = useToast();

  // Fetch all songs to get details for selected ones
  const { data: songs = [] } = useQuery<Song[]>({
    queryKey: ['/api/songs'],
  });

  // Define the order of moments in the ceremony
  const ceremonyOrder: CeremonyMoment[] = [
    'ingresso', 'inizio', 'alleluia', 'offertorio', 'santo', 
    'pace', 'comunione', 'ringraziamento', 'fine'
  ];

  // Calculate completion progress
  const completion = useMemo(() => {
    if (!selectedMoments) return 0;
    const selectedCount = Object.values(selectedMoments).filter(Boolean).length;
    return Math.round((selectedCount / ceremonyOrder.length) * 100);
  }, [selectedMoments]);

  // Check if all moments have been selected
  const isComplete = completion === 100;

  // Helper function to find song details
  const getSongById = (id: number | undefined) => {
    if (!id) return null;
    return songs.find(song => song.id === id) || null;
  };

  // Helper function to capitalize the first letter
  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  // Handle download PDF with possible incomplete selections
  const handleDownloadPdf = async () => {
    const downloadAction = async () => {
      try {
        if (!selectedMoments) return;
        
        // Get the full song details for each selection
        const selectedSongs = ceremonyOrder.map(moment => {
          const songId = selectedMoments[moment];
          return {
            moment,
            song: getSongById(songId)
          };
        }).filter(item => item.song !== null);  // Only include selections that have songs

        // Generate and download the PDF
        await generatePdf(selectedSongs);
        
        toast({
          title: "PDF Downloaded",
          description: "Your song lyrics PDF has been downloaded successfully.",
        });
      } catch (error) {
        console.error('Error generating PDF:', error);
        toast({
          title: "Error",
          description: "Could not generate PDF. Please try again.",
          variant: "destructive"
        });
      }
    };

    if (isComplete || !onIncompleteSubmit) {
      // If complete or no confirmation function provided, just download
      downloadAction();
    } else {
      // Otherwise use the confirmation function
      onIncompleteSubmit(downloadAction);
    }
  };

  // Handle WhatsApp sharing with possible incomplete selections
  const handleShareWhatsApp = () => {
    const shareAction = () => {
      if (!selectedMoments) return;

      // Create a message with the selected songs
      const songSelections = ceremonyOrder
        .filter(moment => selectedMoments[moment] !== undefined)
        .map(moment => {
          const songId = selectedMoments[moment];
          const song = getSongById(songId);
          return `${capitalizeFirstLetter(moment)}: ${song?.title}`;
        }).join('\n');

      const message = `My Wedding Ceremony Song Selections:\n\n${songSelections}`;
      const encodedMessage = encodeURIComponent(message);
      
      // Open WhatsApp with the pre-filled message
      window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
    };

    if (isComplete || !onIncompleteSubmit) {
      // If complete or no confirmation function provided, just share
      shareAction();
    } else {
      // Otherwise use the confirmation function
      onIncompleteSubmit(shareAction);
    }
  };

  // Function to handle clicking on a moment in the list
  const handleMomentClick = (moment: CeremonyMoment) => {
    // If a callback exists on the parent to handle clicks, call it
    if (window.handleMomentSelect) {
      window.handleMomentSelect(moment);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
      <h3 className="font-display text-xl font-semibold text-primary mb-6">Your Selections</h3>
      
      {/* Selected Songs List */}
      <div id="selected-songs" className="mb-6">
        <div className="flex flex-col gap-3">
          {ceremonyOrder.map((moment) => (
            <div 
              key={moment} 
              className="ceremony-moment-container border border-neutral-200 rounded-lg p-3 hover:border-primary transition-colors cursor-pointer"
              onClick={() => handleMomentClick(moment)}
            >
              <div className="flex items-center justify-between mb-2">
                <h5 className="font-display font-medium text-neutral-800">
                  {`${ceremonyOrder.indexOf(moment) + 1}. ${capitalizeFirstLetter(moment)}`}
                </h5>
                <div 
                  className={`text-xs px-2 py-1 rounded-full ${
                    selectedMoments && selectedMoments[moment] !== undefined
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {selectedMoments && selectedMoments[moment] !== undefined
                    ? 'Selected'
                    : 'Click to select'}
                </div>
              </div>
              
              {selectedMoments && selectedMoments[moment] !== undefined && (
                <div className="selected-song">
                  <div className="flex justify-between items-center p-2 bg-neutral-100 rounded">
                    <span className="font-medium">
                      {getSongById(selectedMoments[moment])?.title}
                    </span>
                    <button 
                      className="remove-song-btn text-red-600 hover:text-red-800"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent triggering parent click
                        onRemoveSong(moment);
                      }}
                      aria-label={`Remove song from ${moment}`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Completion Status and Actions */}
      <div className="mb-6">
        <Progress value={completion} className="w-full h-2.5 bg-neutral-200 mb-2" />
        <p className="text-sm text-neutral-600 mb-4">
          {`${isComplete ? 'All' : Math.round(completion / (100 / ceremonyOrder.length))}/${ceremonyOrder.length} selections made`}
        </p>
        <div className="flex flex-wrap gap-3">
          <Button
            className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            onClick={handleDownloadPdf}
          >
            <div className="flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download PDF
            </div>
          </Button>
          <Button
            className="flex-1 px-4 py-2 bg-[#25D366] text-white rounded-lg hover:bg-opacity-90 transition-colors"
            onClick={handleShareWhatsApp}
          >
            <div className="flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
              </svg>
              Share via WhatsApp
            </div>
          </Button>
        </div>
      </div>
      
      {/* Contact Choir Form */}
      <ShareOptionsForm 
        selectedSongs={selectedMoments} 
        songsData={songs} 
        isComplete={isComplete} 
        onIncompleteSubmit={onIncompleteSubmit}
      />
    </div>
  );
}

// Add a property to the window object to allow communication between components
declare global {
  interface Window {
    handleMomentSelect?: (moment: CeremonyMoment) => void;
  }
}
