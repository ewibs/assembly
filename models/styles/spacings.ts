
export const PositionTypes = [ 'static', 'relative', 'absolute', 'fixed', 'sticky' ] as const;
export type PositionType = (typeof PositionTypes)[number];

export type Spacing = { top: string, bottom: string, right: string, left: string };
export type Spacings = Partial<{
  positionType: PositionType;
  position: Partial<Spacing>;
  margin: Partial<Spacing>;
  padding: Partial<Spacing>;
  size: Partial<{ width: string; height: string; }>;
  zIndex: number;
}>;
