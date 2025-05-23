import { useState, useMemo } from "react";
import { Song, CeremonyMoment } from "@shared/schema";
import SongCard from "./SongCard";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import LyricsModal from "./LyricsModal";

interface SongGalleryProps {
  onSelectMoment: (songId: number, moment: CeremonyMoment) => void;
  selectedMoments: { [key in CeremonyMoment]?: number } | null;
}

export default function SongGallery({ onSelectMoment, selectedMoments }: SongGalleryProps) {
  const [currentFilter, setCurrentFilter] = useState<CeremonyMoment | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [lyricsModalOpen, setLyricsModalOpen] = useState(false);

  const { data: songs = [], isLoading } = useQuery<Song[]>({
    queryKey: ['/api/songs'],
  });

  // Track which songs are already selected in any moment
  const selectedSongIds = useMemo(() => {
    if (!selectedMoments) return [];
    return Object.values(selectedMoments).filter(id => id !== undefined) as number[];
  }, [selectedMoments]);

  // Filter songs based on filter and search
  const filteredSongs = useMemo(() => {
    return songs.filter(song => {
      const matchesFilter = currentFilter === 'all' || song.suitableMoments.includes(currentFilter);
      const matchesSearch = !searchTerm || 
        song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        song.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [songs, currentFilter, searchTerm]);

  // Define our ceremony moments
  const ceremonyMoments: (CeremonyMoment | 'all')[] = [
    'all', 'ingresso', 'inizio', 'alleluia', 'offertorio', 
    'santo', 'pace', 'comunione', 'ringraziamento', 'fine'
  ];

  // Helper function to capitalize the first letter
  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const handleViewLyrics = (song: Song) => {
    setSelectedSong(song);
    setLyricsModalOpen(true);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="font-display text-xl font-semibold text-primary mb-6">Song Selection</h3>
      
      {/* Filter Controls */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-3 mb-4">
          {ceremonyMoments.map((moment) => (
            <Button
              key={moment}
              variant={currentFilter === moment ? "default" : "outline"}
              className={`px-4 py-2 text-sm font-medium rounded-full ${
                currentFilter === moment
                  ? 'border-2 border-primary text-white bg-primary'
                  : 'border-2 border-neutral-200 text-neutral-800 bg-white hover:bg-primary hover:text-white hover:border-primary'
              }`}
              onClick={() => setCurrentFilter(moment)}
            >
              {moment === 'all' ? 'All Songs' : capitalizeFirstLetter(moment)}
            </Button>
          ))}
        </div>
        <div className="relative">
          <Input
            type="text"
            id="song-search"
            placeholder="Search songs by title..."
            className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>
      
      {/* Song Gallery */}
      {isLoading ? (
        <div className="flex justify-center p-6">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="song-gallery">
          {filteredSongs.map((song) => (
            <SongCard
              key={song.id}
              song={song}
              isSongSelected={selectedSongIds.includes(song.id)}
              onViewLyrics={handleViewLyrics}
              onSelectMoment={onSelectMoment}
              selectedMoments={selectedMoments}
            />
          ))}
          {filteredSongs.length === 0 && (
            <div className="col-span-2 py-8 text-center text-neutral-500">
              No songs found matching your criteria. Try adjusting your filters.
            </div>
          )}
        </div>
      )}

      {/* Lyrics Modal */}
      <LyricsModal 
        song={selectedSong} 
        isOpen={lyricsModalOpen} 
        onClose={() => setLyricsModalOpen(false)} 
      />
    </div>
  );
}
