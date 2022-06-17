export function WriteCSSRule(content: Partial<CSSStyleDeclaration>, module: string): string {
  if (Object.values(content).filter(v => !!v).length == 0) { return ''; }
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