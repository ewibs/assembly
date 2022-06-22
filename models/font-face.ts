export const FontFormats = ["woff", "woff2", "truetype", "opentype", "embedded-opentype", "svg"] as const;
export type FontFormat = (typeof FontFormats)[number];

export const FontDescriptors = [
  'ascent-override',
  'descent-override',
  'font-display',
  'font-stretch',
  'font-style',
  'font-weight',
  'font-variant',
  'font-feature-settings',
  'font-variation-settings',
  'line-gap-override',
  'size-adjustExperimental',
  'unicode-range'
] as const;
export type FontDescriptor = (typeof FontDescriptors)[number];
export type FontDescriptorObject = { [Key in FontDescriptor]: Key extends 'font-weight' ? number : string };

export interface IFontFace {
  family: string;
  sources: {
    url: string,
    format?: FontFormat;
    descriptors?: Partial<FontDescriptorObject>
  }[];
}