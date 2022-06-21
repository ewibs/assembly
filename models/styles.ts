export type Background = Partial<{
  attachment: string,
  clip: string,
  color: string,
  image: string,
  origin: string,
  position: string,
  repeat: string,
  size: string,
}>

export type StyleDeclarations = Partial<
  Omit<
    CSSStyleDeclaration,
    'background' |
    'backgroundAttachment' |
    'backgroundClip' |
    'backgroundColor' |
    'backgroundImage' |
    'backgroundOrigin' |
    'backgroundPosition' |
    'backgroundRepeat' |
    'backgroundSize'
  > & {
    background: Background[];
  }
>;

export const MediaTypes = ['all', 'print', 'screen'] as const;
export type MediaType = (typeof MediaTypes)[number];

export const MediaFeatures = [
  'any-hover', 'any-pointer', 'aspect-ratio', 'color', 'color-gamut', 'color-index',
  'display-mode', 'dynamic-range', 'forced-colors', 'grid', 'height', 'hover',
  'inverted-colors', 'monochrome', 'orientation', 'overflow-block', 'overflow-inline',
  'pointer', 'prefers-color-scheme', 'prefers-contrast', 'prefers-reduced-motion',
  'resolution', 'scripting', 'update', 'video-dynamic-range', 'width'
] as const;
export type MediaFeature = (typeof MediaFeatures)[number];

export const MediaFeaturesMinMaxable = ['aspect-ratio', 'height', 'width'] as const;
export type MediaFeatureMinMaxable = (typeof MediaFeaturesMinMaxable)[number];

export type MediaFeatureNonMinMaxable = Exclude<MediaFeature, MediaFeatureMinMaxable>;

export const MediaLogicalOperators = ['not', 'and', 'only'] as const;
export type MediaLogicalOperator = (typeof MediaLogicalOperators)[number];

export type MediaTypeListOperators = Exclude<MediaLogicalOperator, 'and'>;
export type MediaTypeListItem = { operator?: MediaTypeListOperators, type: MediaType };
export type MediaTypeList = MediaTypeListItem[];

export type MediaFeatureListItemGenericBase<Feature extends MediaFeature> = {
  operator?: MediaLogicalOperator;
  feature: Feature;
  value: string;
};

// Credits to: https://stackoverflow.com/a/49725198/2882254
type RequireOnlyOne<T, Keys extends keyof T = keyof T> =
  Pick<T, Exclude<keyof T, Keys>>
  & {
    [K in Keys]-?:
    Required<Pick<T, K>>
    & Partial<Record<Exclude<Keys, K>, undefined>>
  }[Keys];

export type MediaFeatureListItemGeneric<Feature extends MediaFeature> = (Feature extends MediaFeatureMinMaxable ?
  RequireOnlyOne<MediaFeatureListItemGenericBase<Feature> & { min: string, max: string, value: string }, 'min' | 'max' | 'value'> :
  MediaFeatureListItemGenericBase<Feature>);
export type MediaFeatureListItemMinMaxable = MediaFeatureListItemGeneric<MediaFeatureMinMaxable>;
export type MediaFeatureListItemNonMinMaxable = MediaFeatureListItemGeneric<MediaFeatureNonMinMaxable>;
export type MediaFeatureListItem = MediaFeatureListItemMinMaxable | MediaFeatureListItemNonMinMaxable;
export type MediaFeatureList = MediaFeatureListItem[];

export type MediaQuery = {
  types?: MediaTypeList;
  features?: MediaFeatureList;
  styles: StyleDeclarations;
};

export type Styles = {
  mediaQueries?: MediaQuery[];
  base: StyleDeclarations;
};