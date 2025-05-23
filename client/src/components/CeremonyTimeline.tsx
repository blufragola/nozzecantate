import React from "react";
import { CeremonyMoment } from "@shared/schema";

interface CeremonyTimelineProps {
  selectedMoments: { [key in CeremonyMoment]?: number } | null;
  onMomentClick?: (moment: CeremonyMoment) => void;
}

export default function CeremonyTimeline({ selectedMoments, onMomentClick }: CeremonyTimelineProps) {
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

  const handleMomentClick = (moment: CeremonyMoment) => {
    if (onMomentClick) {
      onMomentClick(moment);
    }
  };

  return (
    <div className="flex flex-col space-y-3 my-6 max-w-md mx-auto">
      {ceremonySteps.map((step, index) => (
        <div 
          key={step}
          onClick={() => handleMomentClick(step)}
          className={`ceremony-step flex items-center rounded-md border-2 cursor-pointer
            ${isStepSelected(step) 
              ? 'border-primary bg-primary bg-opacity-10 text-primary' 
              : 'border-neutral-200 text-neutral-800 hover:border-primary-light hover:bg-primary-light hover:bg-opacity-5'} 
            px-4 py-3 text-sm font-medium transition-colors duration-300`}
        >
          <div className={`flex items-center justify-center w-8 h-8 rounded-full mr-3 ${
            isStepSelected(step) 
              ? 'bg-primary text-white' 
              : 'bg-neutral-200 text-neutral-600'
          }`}>
            {index + 1}
          </div>
          <div className="flex flex-col">
            <span className="font-medium">{capitalizeFirstLetter(step)}</span>
            <span className="text-xs mt-1">
              {isStepSelected(step) 
                ? "Selected" 
                : "Click to select a song"}
            </span>
          </div>
          {isStepSelected(step) && (
            <div className="ml-auto">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
          {!isStepSelected(step) && (
            <div className="ml-auto">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
