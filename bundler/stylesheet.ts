import { format } from 'prettier';
import parserCss from 'prettier/parser-postcss';

import { Styles } from '../models/styles';
import { WriteCSSRule } from '../utils/css';
import { BuildFontFaces } from '../utils/font-face';
import { IBundleContext } from './compile';
import { ModuleMap } from './module-map';
import { normalizeCSS } from './normalize';

export class CompilerStyleSheet extends ModuleMap<Styles> {

  constructor(public readonly context: IBundleContext) { super(); }

  parser = 'css';

  renderModule(content: Styles, module: string): string {
    return WriteCSSRule(content, module, this.context.assets);
  }

  wrap(renderedContent: string): string {
    return `
      /* Generated by ewibs: http://ewibs.app */
      ${renderedContent}
    `;
  }

  // TODO: This should probably not exist
  private unwrap(renderedContent: string): string {
    return renderedContent.replace('/* Generated by ewibs: http://ewibs.app */', '');
  }

  override renderGlobal(): string {
    const base = this.wrap(`
      ${BuildFontFaces(this.context.assembly.settings.globalStyle.fontFaces, this.context.assets)}
      ${this.renderModule(this.context.assembly.settings.globalStyle.styles, 'body, html')}
      ${this.unwrap(super.renderGlobal())}
    `);
    return format(`
      ${this.context.assembly.settings.globalStyle.normalize ? normalizeCSS : ''}
      ${base}
    `, { parser: this.parser, plugins: [parserCss] });
  }

}