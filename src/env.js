export const MANNY_MODEL =
  process.env.NODE_ENV === "production"
    ? "https://d2tm2f4d5v0kas.cloudfront.net/3.0/manny.fbx"
    : "assets/models/manny.fbx";

export const MANNY_TEXTURE_DEFAULT =
  process.env.NODE_ENV === "production"
    ? "https://d2tm2f4d5v0kas.cloudfront.net/3.0/manny_body_texture.jpg"
    : "assets/models/manny_body_texture.jpg";

export const CLIPS_HOST =
  process.env.NODE_ENV === "production"
    ? "https://d2tm2f4d5v0kas.cloudfront.net/clips/"
    : "assets/clips/";
