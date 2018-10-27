export const MANNY_URL = process.env.NODE_ENV === 'production'
  ? 'https://d2tm2f4d5v0kas.cloudfront.net/Manny.fbx'
  : 'assets/models/Manny.fbx';

export const CLIPS_HOST = process.env.NODE_ENV === 'production'
  ? 'https://d2tm2f4d5v0kas.cloudfront.net/clips/'
  : 'assets/clips/';
