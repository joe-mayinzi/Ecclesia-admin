import { ReactElement } from "react";

import {
  PrivilegesEnum,
  SondageQuestionTypeEnum,
  TypeContentEnum,
} from "./enum";

// start ....... interface generic ...... start
export interface PayloadAdmin {
  sub: number;
  nom: string;
  prenom: string;
  telephone: string;
  email: string;
  username: string | null;
  profil: string;
  status: string;
  privileges: string[];
  iat: number;
  exp: number;
}

export interface AuthResponse {
  user: PayloadAdmin;
  access_token: string;
  refresh_token: string;
}


export interface PayloadUserInterface {
  sub: number;
  nom: string;
  prenom: string;
  telephone: string;
  email: string;
  photo?: string;
  couverture?: string;
  username: null;
  privilege_user: string;
  eglise: Eglise;
  ville: string;
  pays: string;
  adresse: string;
  iat: number;
  exp: number;
}

export interface NotificationContent {
  createdAt: Date;
  id_content: number;
  type_content: TypeContentEnum;
  img_content: string;
  img_eglise: string;
  body: string;
  title: string;
  notificationId: number;
  status: boolean;
}

export interface MapsInterface {
  x: number;
  y: number;
}

export interface Links {
  first: string;
  previous: string;
  next: string;
  last: string;
}
export interface Meta {
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}
export interface Token {
  access_token: string;
  refresh_token: string;
}
// end ....... interface generic ....... end

// start ..... interface for get or find data ....... start
export interface Users {
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
  id: number;
  nom: string;
  prenom: string;
  telephone: string;
  email: string;
  sexe: null | string;
  profil: null | string;
  datenaissance: Date | null;
  adresse: null | string;
  ville: null | string;
  pays: null | string;
  username: null;
  salt: string;
  password: string;
  hashedRt: string;
  privilege: PrivilegesEnum;
  status: string;
  confirm: boolean;
  eglise: Eglise;
}
export interface Eglise {
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
  id_eglise: number;
  nom_eglise: string;
  username_eglise: string;
  photo_eglise: string;
  couverture_eglise: string;
  sigle_eglise: string;
  adresse_eglise: string;
  ville_eglise: string;
  pays_eglise: string;
  nombrefidel_eglise: string;
  status_eglise: string;
  payement_eglise: boolean;
  programme?: Programme[];
  word_of_day_eglise: string;
  about_eglise: string;
  localisation_eglise: string[];
}

export interface EglisePaginated {
  items: Eglise[];
  meta: Meta;
  links: Links;
}

export interface StatistiqueEglise {
  audios: number;
  videos: number;
  livres: number;
  lives: number;
  members: number;
  pragrammes: number;
  annonces: number;
  images: {
    publication: number;
    photo: number;
  };
  communiques: number;
  likes: number;
  comments: number;
  favoris: number;
}
export interface ContentAbout {
  title: string;
  content: ReactElement;
}

export interface Commentaires {
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
  id: number;
  commentaire: string;
  users: Users;
}
export interface Favoris {
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
  id: number;
  users?: Users;
}

export interface Likes {
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
  id: number;
  users?: Users;
}
export interface Programme {
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
  id: number;
  titre: string;
  sousProgramme: SousProgramme[];
}
export interface SousProgramme {
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
  id: number;
  debut: Date;
  fin: Date;
  libelle: string;
}
export interface Communiques {
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  id: number;
  communique: string;
}
export interface subjectForum {
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  id: number;
  title: string;
  description: string;
}
// end ........ interface for get or find data  ...... end

// interface for get or find data paginated
export interface ItemPicture {
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  id: number;
  descrition: string;
  photos: string[];
  sharecode: null | string;
  eglise: Eglise;
  favoris: Favoris[];
  commentaire: Commentaires[];
  share: any[];
  likes: Likes[];
}
export interface ItemVideos {
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
  id: number;
  titre: string;
  lien: string;
  photo: string;
  webp: null;
  auteur: string;
  interne: boolean;
  sharecode: string;
  eglise: Eglise;
  favoris: Favoris[];
  likes: Likes[];
  commentaire: Commentaires[];
  share: Favoris[];
}
export interface ItemAbonnement {
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
  id_abonnement: number;
  reference_abonnement: string;
  montant_abonnement: string;
  method_abonnement: string;
}

export interface ItemAnnonces {
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
  id: number;
  contente: string;
  sharecode: string;
}

export interface Content {
  id: number;
  book: string;
  chapter: string;
  verse: string | null;
}

export interface ContentDayPlan {
  createdAt: string; // Vous pouvez utiliser `Date` si vous voulez manipuler des objets date en JavaScript.
  updatedAt: string; // Idem pour `updatedAt`.
  deletedAt: string | null; // Idem pour `deletedAt`, ou laisser en `null` si non utilisé.
  id: number;
  title: string;
  devotion: string;
  day: number;
  contents: Content[];
}

export interface ItemBiblePlanLecture {
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  id: number;
  title: string;
  description: string;
  categorie: string;
  picture: string;
  number_days: number;
  share: any[];
  eglise: Eglise;
}

export interface ItemBibleStudy {
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
  id: number;
  titre: string;
  objectif: string;
  description: string;
  payement: string;
  sharecode: string;
  favoris: Favoris[];
  commentaire: Commentaires[];
  share: any[];
  likes: Likes[];
  contentsBibleStudy: ItemContentBibleStudy[];
  eglise: Eglise;
}

export interface ItemContentBibleStudy {
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
  id: number;
  titre: string;
  image: string;
  content: string;
  sharecode: string;
  favoris: Favoris[];
  commentaire: Commentaires[];
  share: any[];
  likes: Likes[];
}

export interface ItemTesmonial {
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
  id: number;
  description: null;
  link: string;
  status: string;
  sharecode: string;
  eglise: Eglise;
  favoris: Favoris[];
  commentaire: Commentaires[];
  share: any[];
  likes: Likes[];
  users: Users;
}

export interface ItemQuizBiblique {
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
  id: number;
  title: string;
  description: string;
  difficulty: string;
  type: string;
  timer: string;
  questionnairesCount: number;
}
export interface OccurenceQstQuiz {
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
  id: number;
  occurrence: string;
  isresponse: boolean;
}
export interface ResponseQuiz {
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
  id: number;
  response: string;
  timer: string;
  question?: QuestionnairesQuiz;
  user: User;
}
export interface QuestionnairesQuiz {
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
  id: number;
  question: string;
  occurrences: OccurenceQstQuiz[];
  responses: ResponseQuiz[];
}

export interface OccurenceSondage {
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
  id: number;
  occurrence: string;
}
export interface QuestionnairesSondage {
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
  id: number;
  question: string;
  type: SondageQuestionTypeEnum;
  occurrences: OccurenceSondage[];
  responses: [];
}
export interface ItemQuizBibliqueDetail {
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
  id: number;
  title: string;
  description: string;
  difficulty: string;
  type: string;
  timer: string;
  questionnairesCount: number;
  questionnaires: QuestionnairesQuiz[];
}
export interface ResultAnswerQuiz {
  user: User;
  correct: number;
  total: number;
  totalTime: number;
  accuracy: number;
  avgTime: number;
}
export interface ItemSondageQst {
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
  id: number;
  title: string;
  objectif: string;
  public: boolean;
  eglise: Eglise;
  totalQuestion: number;
  totalAnswered: number;
}
export interface ItemSondageQstDetail extends ItemSondageQst {
  questions: QuestionnairesSondage[];
}

export interface ItemPrayerWall {
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
  id: number;
  prayer: string;
  sharecode: string;
  user: User;
  favoris: Favoris[];
  commentaire: Commentaires[];
  share: any[];
  likes: Likes[];
}
export interface otherInterface {
  book: number;
  chapter: number;
  verset: string;
  version: string;
  description: string;
}

export interface BibleStudyPaginated {
  items: ItemBibleStudy[];
  meta: Meta;
  links: Links;
}

export interface BiblePlanLecturePaginated {
  items: ItemBiblePlanLecture[];
  meta: Meta;
  links: Links;
}

export interface BiblePlanByUserStarted {
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
  id: number;
  user: Users;
  plans: ItemBiblePlanLecture;
}

export interface AnnoncePaginated {
  items: ItemAnnonces[];
  meta: Meta;
  links: Links;
}
export interface VideoPaginated {
  items: ItemVideos[];
  meta: Meta;
  links: Links;
}

export interface AbonnementPaginated {
  items: ItemAbonnement[];
  meta: Meta;
  links: Links;
}

export interface PicturePaginated {
  items: ItemPicture[];
  meta: Meta;
  links: Links;
}
export interface CommentairesPaginated {
  items: Commentaires[];
  meta: Meta;
  links: Links;
}
export interface CommuniquesPaginated {
  items: Communiques[];
  meta: Meta;
  links: Links;
}

export interface TestmonialsPaginated {
  items: ItemTesmonial[];
  meta: Meta;
  links: Links;
}

export interface QuizBibliquePaginated {
  items: ItemQuizBiblique[];
  meta: Meta;
  links: Links;
}
export interface SondageQstPaginated {
  items: ItemSondageQst[];
  meta: Meta;
  links: Links;
}

export interface StatistiqueEglise {
  audios: number;
  videos: number;
  livres: number;
  lives: number;
  members: number;
  pragrammes: number;
  annonces: number;
  images: {
    publication: number;
    photo: number;
  };
  communiques: number;
  likes: number;
  comments: number;
  favoris: number;
}

export interface SearchIterface {
  images: ItemPicture[];
  audios: ItemVideos[];
  videos: ItemVideos[];
  live: ItemVideos[];
  livre: ItemVideos[];
  eglise: Eglise[];
  bibleStudy: ItemBibleStudy[];
  forum: any[];
}

export interface BibleTag {
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
  id: number;
  title: string;
  description: string;
  version: string;
  book: string;
  chapter: string;
  verse: string;
  colorTag: string;
}

export interface BibleHistorique {
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
  id: number;
  title: string | null;
  version: string;
  book: string;
  chapter: string;
  verse: string;
}

export interface ManagementEvent {
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
  id: number;
  name: string;
  description: string;
  dateEvent: Date;
  isBlocked: boolean;
  adressMap: string;
  totalPerson: number;
  isFree: boolean;
  price: number;
  isCancel: null;
  eglise: Eglise;
  totalSubscriptions: number,
  isSubscribe: boolean,
  annonces: string[]
  subscribe: {
    createdAt: Date,
    id: number,
    uuid: string
    isCancel: boolean,
    isChecked: boolean,
    paymentMothod: string,
    paymentReference: string,
  } | {
    createdAt: Date,
    id: number,
    uuid: string
    isCancel: boolean,
    isChecked: boolean,
    paymentMothod: string,
    paymentReference: string,
  }[] | null,
}

export interface ManagementBudget {
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
  id: number;
  budgetLine: string;
  description?: string;
  period: Date;
  amount: number;
  eglise: Eglise;
  expenses?: ManagementExpenses[];
  income?: ManagementIncome[];
}

export interface ManagementIncome {
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
  id: number;
  source: string;
  description?: string;
  amount: number;
  method: string;
  eglise: Eglise;
  budget?: ManagementBudget
}

export interface ManagementExpenses {
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
  id: number;
  amount: number;
  motif: string;
  eglise: Eglise;
  budget?: ManagementBudget
}
// interface for get or find data paginated

export interface CreateAbonnementDto {
  montant_abonnement: string | null;
  method_abonnement: string | null;
  reference_abonnement: string | null;
}

interface User {
  id: number;
  nom: string;
  prenom: string;
  username: string;
  profil: string | null;
  eglise: Eglise;
}

export interface TransactionCaisse {
  // "Approvisionne" | "Depense";
  typeTransaction: string
  description: string;
  sourceApprov: string | null;
  approvCaisse: number | null;
  depense: number | null;
  createdAt: Date;  // La date est convertie en un objet Moment
}

