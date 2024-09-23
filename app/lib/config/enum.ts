export enum TypeContentEnum {
  videos = "videos",
  audios = "audios",
  livres = "livres",
  live = "live",
  programme = "programme",
  images = "images",
  annonces = "annonces",
  communiques = "communiques",
  eglises = "eglises",
  forum = "forum",
  sujetForum = "sujetForum",
  bibleStudy = "bibleStudy",
  bibleStudyContent = "bibleStudyContent",
  testimonials = "testimonials",
  formations = "formations",
  quiz = "quiz",
  temoignages = "temoignages",
  prayer = "prayer-wall",
}

export enum PrivilegesEnum {
  FIDELE = "fidele_eglise",
  ADMIN_EGLISE = "administrateur_eglise",
}

export enum AppointmentEnum {
  AWAITING = "awaiting",
  CANCEL = "cancel",
  APPROUVED = "approuved",
  RECEIVED = "received",
  POSTPONE = "postpone",
}

export enum StatusAcounteEnum {
  ACTIF = "actif",
  INACTIF = "inactif",
}

export enum TestimonialStatusEnum {
  ACTIVE = "approved",
  INACTIVE = "dismiss",
  PENDING = "pending",
}

export enum PlanReadingCategoryEnum {
  priere = "prière",
  foi = "foi",
  delivrance = "délivrance",
}

export enum QuizLevelDifficulty {
  hard = "hard",
  easy = "easy",
  middle = "middle",
}

export enum SondageQuestionTypeEnum {
  TRICOLOR = "tricolor",
  LADDER = "ladder",
  MCO = "multiple_choice_open",
  MCC = "multiple_choice_close",
  MCOT = "multiple_choice_other",
}
