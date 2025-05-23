import { Song, CeremonyMoment } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { useRef, useState, useEffect } from "react";
import { Howl } from "howler";

interface SongCardProps {
  song: Song;
  isSongSelected: boolean;
  onViewLyrics: (song: Song) => void;
  onSelectMoment: (songId: number, moment: CeremonyMoment) => void;
  selectedMoments: { [key in CeremonyMoment]?: number } | null;
}

export default function SongCard({
  song,
  isSongSelected,
  onViewLyrics,
  onSelectMoment,
  selectedMoments,
}: SongCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const soundRef = useRef<Howl | null>(null);

  useEffect(() => {
    // Initialize Howl when the component mounts
    soundRef.current = new Howl({
      src: [song.audioUrl],
      html5: true,
      onend: () => {
        setIsPlaying(false);
      }
    });

    // Cleanup when component unmounts
    return () => {
      if (soundRef.current) {
        soundRef.current.stop();
      }
    };
  }, [song.audioUrl]);

  const togglePlay = () => {
    if (!soundRef.current) return;

    if (isPlaying) {
      soundRef.current.pause();
    } else {
      soundRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Helper function to capitalize the first letter
  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <div 
      className={`song-card bg-white border ${isSongSelected ? 'border-primary' : 'border-neutral-200'} 
        rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow`}
      data-song-id={song.id}
      data-moments={song.suitableMoments.join(",")}
    >
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-display text-lg font-semibold">{song.title}</h4>
          <div className="flex flex-wrap gap-1">
            {song.suitableMoments.map((moment) => (
              <span 
                key={moment} 
                className="px-2 py-1 bg-primary-light bg-opacity-20 text-primary text-xs rounded-full"
              >
                {capitalizeFirstLetter(moment)}
              </span>
            ))}
          </div>
        </div>
        
        <p className="text-neutral-600 text-sm mb-3 line-clamp-2">{song.description}</p>
        
        <div className="mb-3 flex items-center">
          <Button 
            onClick={togglePlay}
            variant="ghost" 
            size="sm"
            className="mr-2"
          >
            {isPlaying ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6M5 5h14v14H5z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </Button>
          <div className="flex-1 h-2 bg-neutral-200 rounded-full">
            {isPlaying && <div className="h-full bg-primary rounded-full animate-[progress_30s_linear]"></div>}
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <button 
            className="lyrics-btn text-sm text-primary hover:text-primary-dark font-medium flex items-center"
            onClick={() => onViewLyrics(song)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            View Lyrics
          </button>
          <div className="flex gap-2">
            {song.suitableMoments.map((moment) => {
              const isSelected = selectedMoments && selectedMoments[moment] === song.id;
              const isMomentFilled = selectedMoments && selectedMoments[moment] !== undefined;
              const isDisabled = isSongSelected && !isSelected;

              return (
                <Button
                  key={moment}
                  size="sm"
                  variant={isSelected ? "default" : "outline"}
                  className={`px-3 py-1 text-xs rounded ${
                    isSelected 
                      ? 'bg-accent-green text-white' 
                      : 'bg-white text-accent-green border-accent-green'
                  } ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-opacity-90'}`}
                  onClick={() => !isDisabled && onSelectMoment(song.id, moment)}
                  disabled={isDisabled || (isMomentFilled && !isSelected)}
                >
                  For {capitalizeFirstLetter(moment)}
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
