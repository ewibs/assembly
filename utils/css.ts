import { MediaFeatureList, MediaFeatureListItem, MediaQuery, MediaTypeList, StyleDeclarations, Styles } from "../models/styles";

function WriteCSSRuleContent(content: StyleDeclarations, module: string): string {
  if (Object.values(content || {}).filter(v => !!v).length == 0) { return ''; }
  return `
    ${module} {
      ${Object.entries(content)
      .filter(([prop, value]) => !!prop && !!value)
      .map(([prop, value]) => {
        let regex = /[a-z][A-Z]/g;
        let tries = 0;
        while (regex.test(prop) && ++tries < 10) {
          let index = regex.lastIndex - 1;
          prop = prop.substring(0, index) + '-' + prop.substring(index);
        }
        return `${prop.toLowerCase()}: ${value};`;
      }).join('\n')
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

export function GenerateCSSRuleQueries(content: Styles, module: string): { [query: string]: string } {
  return (content.mediaQueries || []).reduce((all, query) => ({
    ...all,
    [BuildMediaQueryString(query)]: WriteCSSRuleContent(query.styles, module)
  }), {
    base: WriteCSSRuleContent(content.base, module)
  });
}

export function WriteCSSRule(content: Styles, module: string): string {
  return Object.entries(GenerateCSSRuleQueries(content, module))
    .map(([query, value]) => query === 'base' ? value : `${query} {${value}}`).join('\n');
}

export function GetMediaQueries(content: Styles, module: string): string[] {
  return Object.keys(GenerateCSSRuleQueries(content, module)).filter(v => v !== 'base');
}