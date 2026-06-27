export interface RegisterDTO {
  name: string;
  email: string;
  password: string;

  height?: number;
  weight?: number;

  birthDate?: string;

  gender?: "MALE" | "FEMALE";

  goal?:
    | "WEIGHT_LOSS"
    | "MUSCLE_GAIN"
    | "MAINTENANCE";
}