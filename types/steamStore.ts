// https://store.steampowered.com/api/appdetails?appids=105600

export interface RootStoreData {
  [key: string]: ResponseStore;
}

export interface ResponseStore {
  success: boolean;
  data: DataStore;
}

export interface DataStore {
  type: string;
  name: string;
  steam_appid: number;
  required_age: number;
  is_free: boolean;
  dlc: number[];
  detailed_description: string;
  about_the_game: string;
  short_description: string;
  supported_languages: string;
  header_image: string;
  capsule_image: string;
  capsule_imagev5: string;
  website: string;
  pc_requirements: PcRequirements;
  mac_requirements: MacRequirements;
  linux_requirements: LinuxRequirements;
  developers: string[];
  publishers: string[];
  packages: number[];
  package_groups: PackageGroup[];
  platforms: Platforms;
  categories: Category[];
  genres: Genre[];
  screenshots: Screenshot[];
  movies: Movie[];
  recommendations: Recommendations;
  achievements: Achievements;
  release_date: ReleaseDate;
  support_info: SupportInfo;
  background: string;
  background_raw: string;
  content_descriptors: ContentDescriptors;
  ratings: Ratings;
}

export interface PcRequirements {
  minimum: string;
}

export interface MacRequirements {
  minimum: string;
}

export interface LinuxRequirements {
  minimum: string;
}

export interface PackageGroup {
  name: string;
  title: string;
  description: string;
  selection_text: string;
  save_text: string;
  display_type: number;
  is_recurring_subscription: string;
  subs: Sub[];
}

export interface Sub {
  packageid: number;
  percent_savings_text: string;
  percent_savings: number;
  option_text: string;
  option_description: string;
  can_get_free_license: string;
  is_free_license: boolean;
  price_in_cents_with_discount: number;
}

export interface Platforms {
  windows: boolean;
  mac: boolean;
  linux: boolean;
}

export interface Category {
  id: number;
  description: string;
}

export interface Genre {
  id: string;
  description: string;
}

export interface Screenshot {
  id: number;
  path_thumbnail: string;
  path_full: string;
}

export interface Movie {
  id: number;
  name: string;
  thumbnail: string;
  webm: Webm;
  mp4: Mp4;
  highlight: boolean;
}

export interface Webm {
  '480': string;
  max: string;
}

export interface Mp4 {
  '480': string;
  max: string;
}

export interface Recommendations {
  total: number;
}

export interface Achievements {
  total: number;
  highlighted: Highlighted[];
}

export interface Highlighted {
  name: string;
  path: string;
}

export interface ReleaseDate {
  coming_soon: boolean;
  date: string;
}

export interface SupportInfo {
  url: string;
  email: string;
}

export interface ContentDescriptors {
  ids: number[];
  notes: string;
}

export interface Ratings {
  usk: Usk;
  agcom: Agcom;
  cadpa: Cadpa;
  dejus: Dejus;
}

export interface Usk {
  rating: string;
  descriptors: string;
}

export interface Agcom {
  rating: string;
  descriptors: string;
}

export interface Cadpa {
  rating: string;
}

export interface Dejus {
  rating: string;
  descriptors: string;
}
