import { Song } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { useRef, useState, useEffect, Fragment } from "react";
import { Howl } from "howler";

interface LyricsModalProps {
  song: Song | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function LyricsModal({ song, isOpen, onClose }: LyricsModalProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const soundRef = useRef<Howl | null>(null);

  useEffect(() => {
    // Initialize Howl when a song is selected
    if (song) {
      soundRef.current = new Howl({
        src: [song.audioUrl],
        html5: true,
        onend: () => {
          setIsPlaying(false);
        }
      });
    }

    // Cleanup when component unmounts or song changes
    return () => {
      if (soundRef.current) {
        soundRef.current.stop();
        setIsPlaying(false);
      }
    };
  }, [song]);

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

  if (!isOpen || !song) return null;

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto" 
      aria-labelledby="modal-title" 
      role="dialog" 
      aria-modal="true"
    >
      <div className="flex items-center justify-center min-h-screen px-4">
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        ></div>
        
        <div className="relative bg-white rounded-lg max-w-2xl w-full mx-auto shadow-xl">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 
                className="font-display text-2xl font-semibold text-primary" 
                id="modal-song-title"
              >
                {song.title}
              </h3>
              <Button 
                variant="ghost" 
                className="p-1 rounded-full hover:bg-neutral-100"
                onClick={onClose}
                aria-label="Close"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </Button>
            </div>
            
            <div className="mb-4">
              <h4 className="text-sm font-medium text-neutral-500 mb-2">Suitable for:</h4>
              <div className="flex flex-wrap gap-2">
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
            
            <div>
              <h4 className="text-sm font-medium text-neutral-500 mb-2">Lyrics:</h4>
              <div className="prose max-w-none text-neutral-800 overflow-y-auto max-h-96">
                {song.lyrics.split('\n').map((line, index) => (
                  <Fragment key={index}>
                    {line}
                    <br />
                  </Fragment>
                ))}
              </div>
            </div>
            
            <div className="mt-6 flex items-center">
              <Button
                onClick={togglePlay}
                variant="outline"
                className="mr-4"
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
          </div>
        </div>
      </div>
    </div>
  );
}
