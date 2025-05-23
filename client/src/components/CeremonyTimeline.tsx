import React from "react";
import { CeremonyMoment } from "@shared/schema";

interface CeremonyTimelineProps {
  selectedMoments: { [key in CeremonyMoment]?: number } | null;
}

export default function CeremonyTimeline({ selectedMoments }: CeremonyTimelineProps) {
  // Define the ceremony moments in order
  const ceremonySteps: CeremonyMoment[] = [
    'ingresso', 'inizio', 'alleluia', 'offertorio', 'santo', 
    'pace', 'comunione', 'ringraziamento', 'fine'
  ];

  // Helper function to check if a step is selected
  const isStepSelected = (moment: CeremonyMoment) => {
    return selectedMoments !== null && selectedMoments[moment] !== undefined;
  };

  // Helper function to capitalize the first letter
  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <div className="flex flex-wrap justify-center gap-2 my-6">
      {ceremonySteps.map((step, index) => (
        <div 
          key={step}
          className={`ceremony-step flex flex-col items-center w-20 rounded-md border-2 
            ${isStepSelected(step) 
              ? 'border-primary bg-primary bg-opacity-75 text-white' 
              : 'border-neutral-200 text-neutral-800'} 
            px-2 py-3 text-sm font-medium transition-colors duration-300`}
        >
          <span className="text-xs mb-1">{index + 1}</span>
          <span>{capitalizeFirstLetter(step)}</span>
        </div>
      ))}
    </div>
  );
}
