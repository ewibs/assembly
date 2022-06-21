import fs from 'fs';
import path from 'path';
import { format } from 'prettier';
import parserHTML from "prettier/parser-html";

import { AssemblyMode, IAssembly } from "../models/assembly";
import { PageMeta } from '../models/component';
import { AssetsMap } from './assets-map';
import { CompilePage, IBundleContext } from "./compile";
import { JSModuleMap } from './js-module-map';
import { CompilerStyleSheet } from './stylesheet';

export class Bundle implements IBundleContext {

  public readonly files = new Map<string, string | NodeJS.ArrayBufferView>();
  
  public readonly pages = new Map<string, { html: string, meta: PageMeta }>();
  public readonly cssMM = new CompilerStyleSheet(this) as CompilerStyleSheet; // what even is this and why doesn't typescript like me?
  public readonly jsMM = new JSModuleMap(this) as JSModuleMap; // what even is this and why doesn't typescript like me?
  public readonly assets = new AssetsMap(this) as AssetsMap; // what even is this and why doesn't typescript like me?
  public mode: AssemblyMode;

  constructor(public readonly assembly: IAssembly) { 
    this.mode = assembly.mode;
    this.assembly.components.forEach((component, identifier) => {
      if (!component.meta.page) { return; }
      CompilePage(assembly, this, identifier);
    });
    this.files.set('assets/main.js', this.jsMM.renderGlobal());
    this.files.set('assets/styles.css', this.cssMM.renderGlobal());
    this.pages.forEach(({ html, meta }, identifier) => {
      
      const jsFileName = `assets/${meta.url}.js`;
      const jsContent = this.jsMM.renderForPage(identifier);
      if (jsContent) {
        this.files.set(jsFileName, jsContent);
      }

      const cssFileName = `assets/${meta.url}.css`;
      const cssContent = this.cssMM.renderForPage(identifier);
      if (cssContent) {
        this.files.set(cssFileName, cssContent);
      }

      try {
        this.files.set(`${meta.url}.html`, format(`
          <html>
            <head>
              <title>${meta.url}</title>
              <base href="${path.relative(path.dirname(meta.url), '') || './'}">
              <meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no">
  
              <link rel="stylesheet" href="assets/styles.css">
              ${cssContent ? `<link rel="stylesheet" href="${cssFileName}">` : ''}
  
            </head>
            <body class="${identifier}">
              ${html}
              <script type="text/javascript" src="assets/main.js"></script>
              ${jsContent ? `<script type="text/javascript" src="${jsFileName}"></script>` : ''}
            </body>
          </html>
        `, { parser: 'html', plugins: [parserHTML] } ));
      } catch (e) {
        console.error(`Error while parsing html ${e}`)
        this.files.set(`${meta.url}.html`, `
          <h1 style="color: red; font-weight: bold;">Error while parsing html ${e}</h1>
        `);
      }
    });
    this.assets.assets.forEach((v, key) => this.files.set(`assets/${key}`, v.file));
  }

  private getAbsFileName(file: string) {
    return path.resolve(this.assembly.absOutPath, file);
  }

  export(clean = true) {
    console.log('Exporting...');
    if (fs.existsSync(this.assembly.absOutPath)) {
      fs.rmSync(this.assembly.absOutPath, { recursive: true, force: true });
    }
    fs.mkdirSync(this.assembly.absOutPath);
    this.files.forEach((content, name) => {
      const dirs = path.dirname(name).split('/');
      let dir = '';
      dirs.forEach(_d => {
        dir += _d + '/';
        if (fs.existsSync(this.getAbsFileName(dir))) { return; }
        fs.mkdirSync(this.getAbsFileName(dir));
      });
      fs.writeFileSync(this.getAbsFileName(name), content);
    });
  }
}