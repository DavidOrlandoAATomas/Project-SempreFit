export interface Meditation {

  id: string;

  mood: number;

  duration: number;

  notes?: string;

  createdAt: string;
}

export interface CreateMeditationDTO {

  mood: number;

  duration: number;

  notes?: string;
}

export interface UpdateMeditationDTO {

mood: number;

duration: number;

notes?: string;
}