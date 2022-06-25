export type Background = Partial<{
  attachment: string,
  clip: string,
  color: string,
  image: string,
  origin: string,
  position: string,
  repeat: string,
  size: string,
}>;

export const BackgroundAttribues = [
  'background', 'backgroundAttachment', 'backgroundClip', 'backgroundColor', 'backgroundImage',
  'backgroundOrigin', 'backgroundPosition', 'backgroundRepeat', 'backgroundSize'
] as const;
export type BackgroundAttribue = (typeof BackgroundAttribues)[number];