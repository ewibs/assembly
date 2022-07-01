import { AssemblyMode, IAssembly } from '../models/assembly';
import {
  ComponentBody,
  PageMeta,
  Primitive,
  RefComponentBody,
  TagComponentBody,
  TagComponentCSS,
  TagComponentJS,
  TextComponentBody,
  UnwrappableHTMLTags,
} from '../models/component';
import { IORefValueMap } from '../models/io';
import { AssetsMap } from './assets-map';
import { JSModuleMap } from './js-module-map';
import { CompilerStyleSheet } from './stylesheet';

export interface IBundleContext {
  mode: AssemblyMode;
  pages: Map<string, { html: string, meta: PageMeta }>;
  cssMM: CompilerStyleSheet;
  jsMM: JSModuleMap;
  assets: AssetsMap;
  readonly assembly: IAssembly;
}

type CompilerResult = string;

export function NormalizeAttributeValue(
  attribute: string,
  value: Primitive,
  context: IBundleContext,
): Primitive {
  if (attribute) {
    return context.assets.resolve(value as string, '')
  }
  return value;
}

export function CompileComponentBody(
  assembly: IAssembly,
  context: IBundleContext,
  page: string,
  _selector: string,
  body: ComponentBody
): CompilerResult {

  let html = ((body as TextComponentBody)?.text) || '';
  const selector = (body as TagComponentBody)?.identifier ? `.${(body as TagComponentBody)?.identifier}` : _selector;

  if ((body as TagComponentJS)?.js && (body as TagComponentJS).identifier) {
    context.jsMM.add(page, (body as TagComponentJS).identifier, `
      function onLoad(element) {
        ${(body as TagComponentJS).js}
      }
      
      document.querySelectorAll('.${(body as TagComponentJS).identifier}').forEach(onLoad);

      exports.onLoad = onLoad;
    `);
  }
  if ((body as TagComponentCSS).styles) {
    context.cssMM.add(page, selector, (body as TagComponentCSS).styles);
  }

  if ((body as TextComponentBody).children) {
    (body as TextComponentBody).children!.map((child, index, all): CompilerResult => {
      if ((child as RefComponentBody)?.ref) {
        return CompileComponentIndex(
          assembly,
          context,
          page,
          (child as RefComponentBody).ref,
          (child as RefComponentBody).io
        );
      }
      const absIndex = all.filter(v => !!(child as TagComponentBody).tagName).indexOf(child) + 1;
      // TODO: if an element has no tag then the nth won't work
      return CompileComponentBody(
        assembly,
        context,
        page,
        (child as TagComponentBody).tagName ? `${selector} >
          ${(child as TagComponentBody).tagName}:nth-child(${absIndex})` : selector,
        child
      );
    }).forEach(result => html += `\n${result}`);
  }

  if ((body as TagComponentBody)?.tagName) {
    let attributes: { [key: string]: Primitive } & Partial<{ [key in keyof HTMLElement]: Primitive }> =
      (body as TagComponentBody).attributes || {};
    attributes.class = (body as TagComponentBody)?.identifier;

    const attributesRendered = Object.entries(attributes)
      .filter(([_, val]) => !!val)
      .map(([attr, val]) => `${attr}="${NormalizeAttributeValue(attr, val, context)}"`)
      .join(" ");
    const tag = (body as TagComponentBody)?.tagName!;

    if (UnwrappableHTMLTags.indexOf(tag as any) >= 0) {
      html = `<${tag} ${attributesRendered} />`;
    } else {
      html = `<${tag} ${attributesRendered}>${html}</${tag}>`;
    }
  }

  return `
    ${assembly.mode === AssemblyMode.debug ? `<!-- selector: ${selector} -->` : ''}
    ${html}
  `;
}

export function CompileComponentIndex(
  assembly: IAssembly,
  context: IBundleContext,
  page: string,
  index: string,
  io: IORefValueMap
): CompilerResult {
  if (!assembly.components.has(index)) {
    console.log(assembly.components)
    throw new Error(`Component with identifier ${index} doesn't exist!`);
  }
  const comp = assembly.components.get(index)!;
  eval(`
    ${Object.entries(comp.meta.io?.inputs || {}).map(([key, value]) => `
      comp.body${value.delegation.map(v => typeof v === 'string' ? `.${v}` : `.children[${v}]`).join('')} = ${JSON.stringify(io.inputs[key] || value.default)}
    `)}
  `.trim());

  return `
    ${assembly.mode === AssemblyMode.debug ? `
      <!--
        Component: ${index}
        IO: ${JSON.stringify(io)}
        Comp Data: ${JSON.stringify(comp)}
      -->
    ` : ''}
    ${CompileComponentBody(
    assembly,
    context,
    page,
    `.${index.replace('/', '_')}`,
    comp.body
  )}
  `;
}

export function CompilePage(assembly: IAssembly, context: IBundleContext, page: string) {
  if (!assembly.components.has(page)) { throw new Error(`Page with identifier ${page} doesn't exist!`); }
  const { meta } = assembly.components.get(page)!;
  if (!meta.page) { throw new Error(`Component with identifier ${page} is not a page!`); }

  if (meta.page?.styles && Object.values(meta.page?.styles).filter(v => !!v).length > 0) {
    context.cssMM.add(page, 'body, html', meta.page.styles);
  }

  context.pages.set(page, {
    html: CompileComponentIndex(assembly, context, page, page, { inputs: {} }),
    meta: meta.page!
  });
}