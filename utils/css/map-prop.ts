export function RenderProperty(property: string): string {
  let regex = /[a-z][A-Z]/g;
  let tries = 0;
  let mappedProp = property as string;
  while (regex.test(mappedProp) && ++tries < 10) {
    let index = regex.lastIndex - 1;
    mappedProp = mappedProp.substring(0, index) + '-' + mappedProp.substring(index);
  }
  return mappedProp.toLowerCase();
}

export function RenderPropertyValue(property: string, value: any): string {
  if (!value) { return ''; }
  return `${RenderProperty(property)}: ${value};`
}