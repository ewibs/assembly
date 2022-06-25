export const AlignmentJustifyTypes = [
  'normal',
  'center', 'start', 'end', 'flex-start', 'flex-end', 'left', 'right',
  'space-between', 'space-around', 'space-evenly', 'stretch',
] as const;
export type AlignmentJustifyType = (typeof AlignmentJustifyTypes)[number];

export const AlignmentBaselines = [
  'auto', 'baseline', 'before-edge', 'text-before-edge', 'middle', 'central',
  'after-edge', 'text-after-edge', 'ideographic', 'alphabetic', 'hanging',
  'mathematical', 'top', 'center', 'bottom'
] as const;
export type AlignmentBaseline = (typeof AlignmentBaselines)[number];

export const AlignmentTypes = [
  'normal', 'center', 'start', 'end', 'flex-start', 'flex-end', 'baseline', 'first baseline',
  'last baseline', 'space-between', 'space-around', 'space-evenly', 'stretch'
] as const;
export type AlignmentType = (typeof AlignmentTypes)[number];

export type FlexAlignment = { type: 'flex' } & Partial<{
  flex: string;
  basis: string;
  direction: string;
  flow: string;
  grow: string;
  shrink: string;
  wrap: string;
  alignContent: AlignmentType;
  alignItems: AlignmentType;
  alignmentBaseline: AlignmentBaseline;
  justifyContent: AlignmentJustifyType;
  justifyItems: AlignmentJustifyType;
}>;

// TODO: More declarations needed, i'm just too lazy right now
export type GridAlignment = { type: 'grid' } & Partial<{
  grid: string;
  gridArea: string;
  gridAutoColumns: string;
  gridAutoFlow: string;
  gridAutoRows: string;
  gridColumn: string;
  gridColumnEnd: string;
  gridColumnStart: string;
  gridRow: string;
  gridRowEnd: string;
  gridRowStart: string;
  gridTemplate: string;
  gridTemplateAreas: string;
  gridTemplateColumns: string;
  gridTemplateRows: string;
  masonryAutoFlow: string;
  alignTracks: string;
  justifyTracks: string;
}>;

export type AlignmentBase = Partial<{
  rowGap: string;
  columnGap: string;
  inline: boolean;
}>;

export type Alignment = AlignmentBase & (
  FlexAlignment | GridAlignment | {
    type: 'inline' | 'block' | 'flow-root' | 'contents' | 'block flow' |
      'inline flow' | 'inline flow-root' | 'block flex' | 'inline flex' |
      'block grid' | 'inline grid' | 'block flow-root' | 'table' |
      'table-row' | 'list-item'
  }
);
