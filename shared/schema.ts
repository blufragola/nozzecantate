import { pgTable, text, serial, integer, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Define valid ceremony moments
export const ceremonyMoments = [
  'ingresso',
  'inizio',
  'alleluia',
  'offertorio',
  'santo',
  'pace',
  'comunione',
  'ringraziamento',
  'fine'
] as const;

export type CeremonyMoment = typeof ceremonyMoments[number];

// Helper schema for ceremony moments
export const ceremonyMomentSchema = z.enum(ceremonyMoments);

// Define Songs schema
export const songs = pgTable("songs", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  lyrics: text("lyrics").notNull(),
  audioUrl: text("audio_url").notNull(),
  suitableMoments: text("suitable_moments").array().notNull(),
});

export const insertSongSchema = createInsertSchema(songs).pick({
  title: true,
  description: true,
  lyrics: true,
  audioUrl: true,
  suitableMoments: true,
});

// Define Submissions schema
export const submissions = pgTable("submissions", {
  id: serial("id").primaryKey(),
  coupleNames: text("couple_names").notNull(),
  weddingDate: text("wedding_date").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  notes: text("notes"),
  createdAt: text("created_at").notNull(),
});

export const insertSubmissionSchema = createInsertSchema(submissions).pick({
  coupleNames: true,
  weddingDate: true,
  email: true,
  phone: true,
  notes: true,
});

// Define SubmissionSongs schema (join table)
export const submissionSongs = pgTable("submission_songs", {
  id: serial("id").primaryKey(),
  submissionId: integer("submission_id").notNull(),
  songId: integer("song_id").notNull(),
  moment: text("moment").notNull(),
});

export const insertSubmissionSongSchema = createInsertSchema(submissionSongs).pick({
  submissionId: true,
  songId: true,
  moment: true,
});

// Types for the frontend
export type Song = typeof songs.$inferSelect;
export type InsertSong = typeof insertSongSchema;

export type Submission = typeof submissions.$inferSelect;
export type InsertSubmission = z.infer<typeof insertSubmissionSchema>;

export type SubmissionSong = typeof submissionSongs.$inferSelect;
export type InsertSubmissionSong = z.infer<typeof insertSubmissionSongSchema>;

// Selection schema for frontend use
export const songSelectionSchema = z.object({
  moment: ceremonyMomentSchema,
  songId: z.number(),
});

export type SongSelection = z.infer<typeof songSelectionSchema>;

// Full submission schema that includes song selections
export const fullSubmissionSchema = insertSubmissionSchema.extend({
  songSelections: z.array(
    z.object({
      moment: ceremonyMomentSchema,
      songId: z.number(),
      songTitle: z.string(),
    })
  ),
});

export type FullSubmission = z.infer<typeof fullSubmissionSchema>;
