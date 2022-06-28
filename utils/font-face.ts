import { FontDescriptor, FontFormat, IFontFace } from 'models/font-face';
import path from 'path';

import { ModuleContext } from './css/definitions';

// Propably shouldn't only be based on file ending
export function FormatFromFile(file: string): FontFormat | undefined {
  switch (path.extname(file).slice(1).toLowerCase()) {
    case 'ttf': return 'truetype';
    case 'otf': return 'opentype';
    case 'eot': return 'embedded-opentype';
    default: return path.extname(file).slice(1) as any;
  }
}

type InternalFontFaceMapping = {
  sources: {
    url: string,
    format?: FontFormat;
  }[];
  descriptors: [FontDescriptor, string | number][]
}

export function BuildFontFace(face: IFontFace, context: ModuleContext) {

  const d = face.sources.reduce((entries, current): InternalFontFaceMapping[] => {
    const descriptors = Object.entries(current.descriptors || {})
      .sort((a, b) => a[0].localeCompare(b[0])) as [FontDescriptor, string | number][];
    const index = entries.findIndex(v => JSON.stringify(v.descriptors) === JSON.stringify(descriptors));
    if (index < 0) {
      return [
        ...entries,
        {
          sources: [{
            url: current.url,
            format: current.format
          }],
          descriptors
        }
      ];
    }
    entries[index].sources.push({
      url: current.url,
      format: current.format
    });
    return entries;
  }, [] as InternalFontFaceMapping[])
  return d.map(({ sources, descriptors }) => `
  @font-face {
    font-family: ${face.family};
    src: ${sources.map(v => {
    const format = v.format || FormatFromFile(v.url)
    return `url(${encodeURI(context?.resolve(v.url))}) ${format ? `format("${format}")` : ''}`
  }).join(', \n')};
    ${descriptors!.map(([descriptor, value]) => `${descriptor}: ${value}`).join(';\n')}
  }
  `).join('\n');
}
export function BuildFontFaces(faces: IFontFace[], context: ModuleContext) {
  return faces.map(face => BuildFontFace(face, context)).join('\n\n')
}