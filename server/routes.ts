import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { fullSubmissionSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // API route to get all songs
  app.get("/api/songs", async (req, res) => {
    try {
      const songs = await storage.getAllSongs();
      return res.json(songs);
    } catch (error) {
      console.error("Error fetching songs:", error);
      return res.status(500).json({ message: "Failed to fetch songs" });
    }
  });

  // API route to get a specific song by ID
  app.get("/api/songs/:id", async (req, res) => {
    try {
      const songId = parseInt(req.params.id);
      if (isNaN(songId)) {
        return res.status(400).json({ message: "Invalid song ID" });
      }

      const song = await storage.getSongById(songId);
      if (!song) {
        return res.status(404).json({ message: "Song not found" });
      }

      return res.json(song);
    } catch (error) {
      console.error("Error fetching song:", error);
      return res.status(500).json({ message: "Failed to fetch song" });
    }
  });

  // API route to submit song selections
  app.post("/api/submit-selections", async (req, res) => {
    try {
      // Validate request body
      const submissionData = fullSubmissionSchema.parse(req.body);
      
      // Create submission
      const submission = await storage.createSubmission({
        coupleNames: submissionData.coupleNames,
        weddingDate: submissionData.weddingDate,
        email: submissionData.email,
        phone: submissionData.phone,
        notes: submissionData.notes || "",
        createdAt: new Date().toISOString()
      });

      // Add the song selections
      for (const selection of submissionData.songSelections) {
        await storage.createSubmissionSong({
          submissionId: submission.id,
          songId: selection.songId,
          moment: selection.moment
        });
      }

      return res.status(201).json({
        message: "Submission successful",
        submissionId: submission.id
      });
    } catch (error) {
      console.error("Error creating submission:", error);
      
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ 
          message: "Validation error", 
          errors: validationError.details 
        });
      }
      
      return res.status(500).json({ 
        message: "Failed to create submission"
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
