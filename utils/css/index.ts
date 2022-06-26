import { Styles } from '../../models/styles';
import { Background } from '../../models/styles/background';
import { StyleDeclarations } from '../../models/styles/declarations';
import { MediaFeatureList, MediaFeatureListItem, MediaTypeList } from '../../models/styles/media';
import { Spacing, Spacings } from '../../models/styles/spacings';
import { Text } from '../../models/styles/text';
import { RenderAlignment } from './alignment';
import { RenderBorder } from './border';
import { ModuleContext } from './definitions';
import { RenderPropertyValue } from './map-prop';

const BG_DEFAULT: { [key in keyof Omit<Background, 'color' | 'image'>]: string; } = {
  attachment: 'scroll',
  clip: 'border-box',
  origin: 'padding-box',
  position: '0% 0%',
  repeat: 'repeat',
  size: 'auto auto',
}

function RenderBackgroundValueForKey(key: keyof Background, value: Background[], context?: ModuleContext) {
  switch (key) {
    case 'color': return value.map(v => v[key]).filter(v => !!v)[0];
    default:
      return value.map(v => key === 'image' ? v.image : v[key] || BG_DEFAULT[key]).map(v => {
        switch (key) {
          case 'image': return `url(${!v ? 'undefined' : context?.resolve(v)})`;
          default: return v;
        }
      }).join(', ');
  }
}

function RenderSpacing(type: 'margin' | 'padding', spacing: Spacing, context?: ModuleContext): string {
  return `${type}: ${spacing.top || '0'} ${spacing.right || '0'} ${spacing.bottom || '0'} ${spacing.left || '0'};`;
}

function RenderSpacings(spacings: Spacings, context?: ModuleContext): string {
  return Object.entries(spacings).map(([key, value]) => {
    switch (key) {
      case 'positionType':
        return `position: ${value};`;
      case 'size':
      case 'position':
        return Object.entries(value as any).map(([a, b]) => `${a}: ${b};`).join('\n');
      case 'margin':
      case 'padding':
        return RenderSpacing(key, value as any, context);
      default:
        return RenderPropertyValue(key, value);
    }
  }).join('\n');
}

export function WriteCSSItem<
  Property extends keyof StyleDeclarations,
  Value extends StyleDeclarations[Property]
>(property: Property, value: Value, context?: ModuleContext): string {
  switch (property) {
    case 'background':
      const props = new Set<keyof Background>([
        ...(value as StyleDeclarations["background"])!
          .reduce((all, current) => all.concat(...Object.keys(current) as any), [] as (keyof Background)[])
      ])
      return `${[...props].map((key) => {
        return `background-${key}: ${RenderBackgroundValueForKey(key, value as Background[], context)};`
      }).join('\n')}`;
    case 'spacings': return RenderSpacings(value as Spacings);
    case 'border': return RenderBorder(value as any, context);
    case 'alignment': return RenderAlignment(value as any, context);
    case 'text':
      return Object.entries(value as Text).map(([prop, v]) => RenderPropertyValue(prop, v)).join('\n');
    default:
      return RenderPropertyValue(property, value);
  }
}

function WriteCSSRuleContent(content: StyleDeclarations, module: string, context?: ModuleContext): string {
  if (Object.values(content || {}).filter(v => !!v).length == 0) { return ''; }
  return `
    ${module} {
      ${Object.entries(content)
      .filter(([prop, value]) => !!prop && !!value)
      .map(([prop, value]) => WriteCSSItem(prop as any, value as any, context)).join('\n')
    }
    }
  `
}

export function BuildMediaQueryStringFeature(item: MediaFeatureListItem, isFirst: boolean): string {
  let value: string;
  let prefix: string;

  if ((item as any).max) {
    value = (item as any).max;
    prefix = 'max-';
  } else if ((item as any).min) {
    value = (item as any).min;
    prefix = 'min-';
  } else {
    value = item.value!;
    prefix = '';
  }

  return `${!isFirst ? item.operator || 'and' : ''} (${prefix}${item.feature}: ${value})`;
}

export function BuildMediaQueryString({ types, features }: { types?: MediaTypeList, features?: MediaFeatureList }): string {
  if (!(features && features?.length > 0)) { throw new Error("Features are required for media queries"); }
  // Build the types (if no types or any of t)
  const isAll = !(types && types?.length > 0 && !!types.find(v => v.operator != 'not' && v.type === 'all'));
  let type = isAll ? '' : `${types.map(v => v.operator ? `${v.operator}(${v.type})` : v.type).join(', ')} and `;
  return `@media ${type} ${features.map((v, i) => BuildMediaQueryStringFeature(v, !i)).join(' ')}`;
}

export function GenerateCSSRuleQueries(content: Styles, module: string, context?: ModuleContext): { [query: string]: string } {
  return (content.mediaQueries || []).reduce((all, query) => ({
    ...all,
    [BuildMediaQueryString(query)]: WriteCSSRuleContent(query.styles, module, context)
  }), {
    base: WriteCSSRuleContent(content.base, module, context)
  });
}

export function WriteCSSRule(content: Styles, module: string, context?: ModuleContext): string {
  return Object.entries(GenerateCSSRuleQueries(content, module, context))
    .map(([query, value]) => query === 'base' ? value : `${query} {${value}}`).join('\n');
}

export function GetMediaQueries(content: Styles, module: string, context?: ModuleContext): string[] {
  return Object.keys(GenerateCSSRuleQueries(content, module, context)).filter(v => v !== 'base');
}