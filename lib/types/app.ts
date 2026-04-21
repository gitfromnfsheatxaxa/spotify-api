ls export type Locale = 'en' | 'ru' | 'uz';

export type TimeRange = 'short_term' | 'medium_term' | 'long_term';

export type TimeRangeLabel = '4_weeks' | '6_months' | 'all_time';

export interface GenreStats {
  genre: string;
  count: number;
  percentage: number;
  top_artists: string[];
}

export interface ObsessionScore {
  overall: number;
  diversity: number;
  popularity: number;
  loyalty: number;
  labels: string[];
}

export interface AIRoast {
  roast_text: string;
  tone: 'gentle' | 'playful' | 'harsh';
  language: Locale;
}

export interface ShareTemplate {
  id: string;
  name: string;
  dimensions: { width: number; height: number };
  format: 'png' | 'jpg';
  type: 'instagram_story' | 'download' | 'twitter' | 'custom';
}

export interface VisualFeature {
  id: string;
  name: string;
  description: string;
  icon: string;
  enabled: boolean;
}