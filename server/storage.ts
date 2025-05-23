import { 
  songs, 
  submissions, 
  submissionSongs,
  type Song, 
  type Submission, 
  type SubmissionSong,
  type InsertSubmission,
  type InsertSubmissionSong,
  CeremonyMoment
} from "@shared/schema";

// Interface for storage operations
export interface IStorage {
  // Song operations
  getAllSongs(): Promise<Song[]>;
  getSongById(id: number): Promise<Song | undefined>;
  
  // Submission operations
  createSubmission(submission: InsertSubmission): Promise<Submission>;
  getSubmission(id: number): Promise<Submission | undefined>;
  
  // Submission song operations
  createSubmissionSong(submissionSong: InsertSubmissionSong): Promise<SubmissionSong>;
  getSubmissionSongs(submissionId: number): Promise<SubmissionSong[]>;
}

export class MemStorage implements IStorage {
  private songs: Map<number, Song>;
  private submissions: Map<number, Submission>;
  private submissionSongs: Map<number, SubmissionSong>;
  
  private songIdCounter: number;
  private submissionIdCounter: number;
  private submissionSongIdCounter: number;

  constructor() {
    this.songs = new Map();
    this.submissions = new Map();
    this.submissionSongs = new Map();
    
    this.songIdCounter = 1;
    this.submissionIdCounter = 1;
    this.submissionSongIdCounter = 1;
    
    // Initialize with sample songs
    this.initializeSampleSongs();
  }

  // Song operations
  async getAllSongs(): Promise<Song[]> {
    return Array.from(this.songs.values());
  }

  async getSongById(id: number): Promise<Song | undefined> {
    return this.songs.get(id);
  }

  // Submission operations
  async createSubmission(insertSubmission: InsertSubmission): Promise<Submission> {
    const id = this.submissionIdCounter++;
    const submission: Submission = { id, ...insertSubmission };
    this.submissions.set(id, submission);
    return submission;
  }

  async getSubmission(id: number): Promise<Submission | undefined> {
    return this.submissions.get(id);
  }

  // Submission song operations
  async createSubmissionSong(insertSubmissionSong: InsertSubmissionSong): Promise<SubmissionSong> {
    const id = this.submissionSongIdCounter++;
    const submissionSong: SubmissionSong = { id, ...insertSubmissionSong };
    this.submissionSongs.set(id, submissionSong);
    return submissionSong;
  }

  async getSubmissionSongs(submissionId: number): Promise<SubmissionSong[]> {
    return Array.from(this.submissionSongs.values())
      .filter(song => song.submissionId === submissionId);
  }

  // Initialize sample songs
  private initializeSampleSongs() {
    const sampleSongs: Omit<Song, 'id'>[] = [
      {
        title: "Ave Maria",
        description: "A classic hymn honoring Mary, perfect for the entrance or beginning of the ceremony.",
        lyrics: "Ave Maria, gratia plena\nDominus tecum, benedicta tu\nAve Maria, gratia plena\nDominus tecum, benedicta tu in mulieribus\nEt benedictus fructus ventris tui, Jesus\n\nSancta Maria, Mater Dei\nOra pro nobis peccatoribus\nNunc et in hora mortis nostrae\nAmen.",
        audioUrl: "https://upload.wikimedia.org/wikipedia/commons/d/d7/Bach_Gounod_Ave_Maria.ogg",
        suitableMoments: ["ingresso", "inizio"] as CeremonyMoment[]
      },
      {
        title: "Vieni Spirito d'Amore",
        description: "An invocational hymn calling upon the Holy Spirit, ideal for the beginning of the ceremony.",
        lyrics: "Vieni Spirito d'amore,\nManda a noi dal cielo\nUn raggio della tua luce.\n\nVieni padre dei poveri,\nVieni datore dei doni,\nVieni luce dei cuori.\n\nConsolatore perfetto,\nOspite dolce dell'anima,\nDolcissimo sollievo.",
        audioUrl: "https://upload.wikimedia.org/wikipedia/commons/8/8b/Mendelssohn_-_Spring_Song.ogg",
        suitableMoments: ["inizio"] as CeremonyMoment[]
      },
      {
        title: "Invitato alla Festa",
        description: "A welcoming song inviting guests to participate in the celebration of love.",
        lyrics: "Invitato alla festa di nozze,\nSei venuto, Signore, tra noi,\nCome un giorno a Cana di Galilea.\n\nE ti doni ancora a chi ti cerca,\nCome vino che allieta ogni cuore,\nCome amore che unisce due vite.",
        audioUrl: "https://upload.wikimedia.org/wikipedia/commons/f/f1/Grieg_-_Wedding_Day_at_Troldhaugen.ogg",
        suitableMoments: ["inizio"] as CeremonyMoment[]
      },
      {
        title: "Alleluia Pasquale",
        description: "A joyous Alleluia hymn traditionally sung before the Gospel reading.",
        lyrics: "Alleluia, alleluia, alleluia!\nAlleluia, alleluia, alleluia!\n\nResurrection day arrived\nCelebrate and raise your voices high\nLet the good news echo all around\nJesus Christ is risen from the tomb\n\nAlleluia, alleluia, alleluia!\nAlleluia, alleluia, alleluia!",
        audioUrl: "https://upload.wikimedia.org/wikipedia/commons/5/55/Handel_-_Hallelujah_Chorus.ogg",
        suitableMoments: ["alleluia"] as CeremonyMoment[]
      },
      {
        title: "Servo per Amore",
        description: "A beautiful hymn about service through love, perfect for offertory or communion.",
        lyrics: "Una notte di sudore\nSulla barca in mezzo al mare\nE mentre il cielo s'imbianca già\nTu guardi le tue reti vuote\n\nMa la voce che ti chiama\nUn altro mare ti mostrerà\nE sulle rive di ogni cuore\nLe tue reti getterai\n\nOffri la vita tua come Maria\nAi piedi della croce\nE sarai servo di ogni uomo\nServo per amore\nSacerdote dell'umanità",
        audioUrl: "https://upload.wikimedia.org/wikipedia/commons/0/05/Moonlight_Sonata_Movement_1.ogg",
        suitableMoments: ["offertorio", "comunione"] as CeremonyMoment[]
      },
      {
        title: "Santo Gen Verde",
        description: "A contemporary rendition of the \"Holy, Holy, Holy\" hymn for the Sanctus moment.",
        lyrics: "Santo, Santo, Santo\nIl Signore Dio dell'universo\nI cieli e la terra sono pieni della tua gloria\n\nOsanna, osanna nell'alto dei cieli\nOsanna, osanna nell'alto dei cieli\n\nBenedetto colui che viene nel nome del Signore\n\nOsanna, osanna nell'alto dei cieli\nOsanna, osanna nell'alto dei cieli",
        audioUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e2/Bach_-_Jesu%2C_Joy_of_Man%27s_Desiring.ogg",
        suitableMoments: ["santo"] as CeremonyMoment[]
      },
      {
        title: "Pace a Te",
        description: "A gentle hymn about peace and harmony, ideal for the sign of peace.",
        lyrics: "Pace a te, fratello mio\nPace a te, sorella mia\nPace a tutti gli uomini\nDi buona volontà\n\nPace nella scuola e nella fabbrica\nNella politica e nello sport\nPace in famiglia, pace in automobile\nPace nella chiesa\n\nPace, pace, pace!",
        audioUrl: "https://upload.wikimedia.org/wikipedia/commons/d/d9/Pachelbel%27s_Canon.ogg",
        suitableMoments: ["pace"] as CeremonyMoment[]
      },
      {
        title: "Pane di Vita",
        description: "A hymn celebrating the bread of life, perfect for communion or thanksgiving.",
        lyrics: "Pane di vita sei\nSpezzato per tutti noi\nChi ne mangia per sempre in Te vivrà\nVieni e sazia la fame che c'è\n\nVino di salvezza sei\nVersato per tutti noi\nChi ne beve per sempre in Te vivrà\nVieni e sazia la sete che c'è",
        audioUrl: "https://upload.wikimedia.org/wikipedia/commons/2/2b/Hungarian-dance-no-5.ogg",
        suitableMoments: ["comunione", "ringraziamento"] as CeremonyMoment[]
      },
      {
        title: "Magnificat",
        description: "Mary's canticle of praise, beautiful for thanksgiving or end of ceremony.",
        lyrics: "L'anima mia magnifica il Signore\nE il mio spirito esulta in Dio, mio salvatore\nPerché ha guardato l'umiltà della sua serva\nD'ora in poi tutte le generazioni mi chiameranno beata\n\nGrandi cose ha fatto in me l'Onnipotente\nE Santo è il suo nome\nDi generazione in generazione la sua misericordia\nSi stende su quelli che lo temono",
        audioUrl: "https://upload.wikimedia.org/wikipedia/commons/1/1e/Bach_-_Air_on_the_G_String.ogg",
        suitableMoments: ["ringraziamento", "fine"] as CeremonyMoment[]
      },
      {
        title: "Resta Qui Con Noi",
        description: "A joyful song asking the Lord to remain with us, perfect for the end of ceremony.",
        lyrics: "Le ombre si distendono scende ormai la sera\nE s'allontanano dietro i monti\nI riflessi di un giorno che non finirà\nDi un giorno che ora correrà sempre\nPerché sappiamo che una nuova vita\nDa qui è partita e mai più si fermerà\n\nResta qui con noi il sole scende già\nResta qui con noi Signore è sera ormai\nResta qui con noi il sole scende già\nSe tu sei fra noi la notte non verrà",
        audioUrl: "https://upload.wikimedia.org/wikipedia/commons/b/bc/Vivaldi_-_Winter_%28Four_Seasons%29.ogg",
        suitableMoments: ["fine"] as CeremonyMoment[]
      }
    ];

    // Add sample songs to storage
    sampleSongs.forEach(song => {
      const id = this.songIdCounter++;
      this.songs.set(id, { id, ...song });
    });
  }
}

export const storage = new MemStorage();
