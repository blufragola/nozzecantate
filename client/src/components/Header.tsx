import { useState } from "react";
import { Button } from "@/components/ui/button";
import HelpModal from "./HelpModal";

interface HeaderProps {
  onResetSelections: () => void;
}

export default function Header({ onResetSelections }: HeaderProps) {
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center mb-4 md:mb-0">
          <svg
            width="40"
            height="40"
            viewBox="0 0 40 40"
            className="mr-3"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="20" cy="20" r="20" fill="#8E71AA" opacity="0.2" />
            <path
              d="M20 10C14.48 10 10 14.48 10 20C10 25.52 14.48 30 20 30C25.52 30 30 25.52 30 20C30 14.48 25.52 10 20 10ZM16 23.5C14.62 23.5 13.5 22.38 13.5 21C13.5 19.62 14.62 18.5 16 18.5C17.38 18.5 18.5 19.62 18.5 21C18.5 22.38 17.38 23.5 16 23.5ZM24 23.5C22.62 23.5 21.5 22.38 21.5 21C21.5 19.62 22.62 18.5 24 18.5C25.38 18.5 26.5 19.62 26.5 21C26.5 22.38 25.38 23.5 24 23.5Z"
              fill="#8E71AA"
            />
            <path
              d="M14 15C14 13.9 13.1 13 12 13V27C13.1 27 14 26.1 14 25V15Z"
              fill="#8E71AA"
            />
            <path
              d="M28 13C26.9 13 26 13.9 26 15V25C26 26.1 26.9 27 28 27V13Z"
              fill="#8E71AA"
            />
          </svg>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-primary">
            Nozze Cantate
          </h1>
        </div>
        <div className="flex gap-4">
          <Button
            variant="outline"
            className="px-4 py-2 text-sm border border-primary text-primary hover:bg-primary-light hover:text-white"
            onClick={() => setIsHelpModalOpen(true)}
          >
            Help
          </Button>
          <Button
            variant="outline"
            className="px-4 py-2 text-sm border border-neutral-200 text-neutral-800 hover:bg-neutral-200"
            onClick={onResetSelections}
          >
            Resetta selezione
          </Button>
        </div>
      </div>

      <HelpModal isOpen={isHelpModalOpen} onClose={() => setIsHelpModalOpen(false)} />
    </header>
  );
}
