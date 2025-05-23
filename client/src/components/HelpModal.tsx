import { Button } from "@/components/ui/button";

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HelpModal({ isOpen, onClose }: HelpModalProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto" 
      aria-labelledby="help-modal-title" 
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
                id="help-modal-title"
              >
                How to Use This Planner
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
            
            <div className="prose max-w-none">
              <h4>Easy Steps to Plan Your Wedding Music</h4>
              <ol>
                <li><strong>Browse Songs</strong> - Filter songs by ceremony moment or search by title.</li>
                <li><strong>Preview Songs</strong> - Listen to audio samples and view lyrics to find the perfect match.</li>
                <li><strong>Select Songs</strong> - Choose one song for each of the nine ceremony moments.</li>
                <li><strong>Review Selections</strong> - Check your chosen songs in the "Your Selections" panel.</li>
                <li><strong>Download or Share</strong> - Generate a PDF of lyrics or share your selections via WhatsApp.</li>
                <li><strong>Send to Choir</strong> - Fill out the form with your details to submit your selections to the choir.</li>
              </ol>
              
              <h4>About Song Selection</h4>
              <p>Each song can be used for one or more specific moments in the ceremony. Once you select a song for a particular moment, it becomes unavailable for other moments to prevent duplicates.</p>
              
              <h4>The Nine Ceremony Moments</h4>
              <ol>
                <li><strong>Ingresso</strong> - Entrance processional</li>
                <li><strong>Inizio</strong> - Beginning of the ceremony</li>
                <li><strong>Alleluia</strong> - Before the Gospel reading</li>
                <li><strong>Offertorio</strong> - Offertory/Presentation of gifts</li>
                <li><strong>Santo</strong> - Sanctus hymn</li>
                <li><strong>Pace</strong> - Sign of peace</li>
                <li><strong>Comunione</strong> - Communion</li>
                <li><strong>Ringraziamento</strong> - Thanksgiving after communion</li>
                <li><strong>Fine</strong> - Recessional at the end</li>
              </ol>
              
              <p>If you need further assistance, please contact the choir director at choir@weddingsongs.example.com or call +1 (123) 456-7890.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
