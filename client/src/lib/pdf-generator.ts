import { CeremonyMoment, Song } from "@shared/schema";

interface SongSelection {
  moment: CeremonyMoment;
  song: Song | null;
}

/**
 * Generates a PDF containing the selected songs and their lyrics
 * and initiates a download in the browser
 */
export async function generatePdf(songSelections: SongSelection[]): Promise<void> {
  try {
    // Get PDF.js library dynamically
    const { jsPDF } = await import('jspdf');
    
    // Create a new PDF document
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    // Define margins and positions
    const margin = 20;
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    let currentY = margin;

    // Add title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Wedding Ceremony Song Selections", pageWidth / 2, currentY, { align: "center" });
    currentY += 10;

    doc.setFontSize(12);
    doc.text("Created on " + new Date().toLocaleDateString(), pageWidth / 2, currentY, { align: "center" });
    currentY += 15;

    // Helper function to add a new page if needed
    const checkForNewPage = (requiredSpace: number) => {
      if (currentY + requiredSpace > pageHeight - margin) {
        doc.addPage();
        currentY = margin;
        return true;
      }
      return false;
    };

    // Process each song
    for (const selection of songSelections) {
      if (!selection.song) continue;

      const momentName = capitalizeFirstLetter(selection.moment);
      
      // Make sure we have enough space for at least the moment title and song title
      checkForNewPage(20);

      // Add moment title
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text(`${momentName}`, margin, currentY);
      currentY += 8;

      // Add song title
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      doc.text(`Song: ${selection.song.title}`, margin, currentY);
      currentY += 8;

      // Process lyrics - split into lines
      const lyrics = selection.song.lyrics;
      const lyricsLines = lyrics.split('\n');

      doc.setFontSize(10);
      doc.setFont("helvetica", "italic");
      
      for (const line of lyricsLines) {
        // Skip empty lines but still increase spacing
        if (!line.trim()) {
          currentY += 4;
          continue;
        }

        // Check if we need a new page
        checkForNewPage(6);
        
        // Handle long lines by wrapping text
        const textWidth = doc.getStringUnitWidth(line) * 10 / doc.internal.scaleFactor;
        const maxWidth = pageWidth - (2 * margin);
        
        if (textWidth > maxWidth) {
          const splitLines = doc.splitTextToSize(line, maxWidth);
          for (const splitLine of splitLines) {
            doc.text(splitLine, margin, currentY);
            currentY += 5;
            checkForNewPage(5);
          }
        } else {
          doc.text(line, margin, currentY);
          currentY += 5;
        }
      }

      // Add some space after each song
      currentY += 10;
    }

    // Add a footer
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text("Wedding Song Planner - Download generated on " + new Date().toLocaleString(), 
              pageWidth / 2, pageHeight - 10, { align: "center" });

    // Save the PDF
    doc.save("wedding-ceremony-songs.pdf");

  } catch (error) {
    console.error("Failed to generate PDF", error);
    throw new Error("Failed to generate PDF");
  }
}

// Helper function to capitalize the first letter
function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
