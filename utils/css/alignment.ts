import { Alignment, FlexAlignment, GridAlignment } from '../../models/styles/alignment';
import { ModuleContext } from './definitions';
import { RenderPropertyValue } from './map-prop';

function RenderFlexAlignment(flex: FlexAlignment, context?: ModuleContext): string {
  return [
    [
      'flex', 'basis', 'direction', 'flow', 'grow', 'shrink', 'wrap',
    ].map(v => RenderPropertyValue('flex-' + v, (flex as any)[v])).filter(v => !!v).join('\n'),
    [
      'alignContent', 'alignItems', 'alignmentBaseline', 'justifyContent', 'justifyItems'
    ].map(v => RenderPropertyValue(v, (flex as any)[v])).filter(v => !!v).join('\n')
  ].join('\n');
}

function RenderGridAlignment(grid: GridAlignment, context?: ModuleContext): string {
  return [
    'grid', 'gridArea', 'gridAutoColumns', 'gridAutoFlow', 'gridAutoRows', 'gridColumn', 'gridColumnEnd',
    'gridColumnStart', 'gridRow', 'gridRowEnd', 'gridRowStart', 'gridTemplate', 'gridTemplateAreas',
    'gridTemplateColumns', 'gridTemplateRows', 'masonryAutoFlow', 'alignTracks', 'justifyTracks'
  ].map(v => RenderPropertyValue(v, (grid as any)[v])).filter(v => !!v).join('\n');
}

export function RenderAlignment(alignment: Alignment, context?: ModuleContext): string {
  const display = alignment.inline && alignment.type !== 'inline' ? `inline-${alignment.type}` : alignment.type;

  return `
    ${RenderPropertyValue('display', display)};
    ${(() => {
      switch (alignment.type) {
        case 'flex': return RenderFlexAlignment(alignment).trim();
        case 'grid': return RenderGridAlignment(alignment).trim();
        default: return '';
      }
    })()}
    ${RenderPropertyValue('rowGap', alignment.rowGap).trim()}
    ${RenderPropertyValue('columnGap', alignment.columnGap).trim()}
  `.trim().replace('\n', '');
}