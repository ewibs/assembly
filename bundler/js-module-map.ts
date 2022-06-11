import { ModuleMap } from './module-map';


export class JSModuleMap extends ModuleMap<string> {

  override add(page: string, module: string, content: string) {
    if ([...(this.map.get(`custom/${module}`)?.usedByPages || [])].indexOf(page) >= 0) {
      return;
    }
    super.add(page, `custom/${module}`, content);
    const pageModule = `page/${page}`
    if (!this.map.has(pageModule)) {
      this.map.set(pageModule, {
        usedByPages: new Set<string>([page]),
        content: ''
      });
    }
    this.map.get(pageModule)!.content += `
      require('@rothert/spbp/modules/custom/${module}');
    `;
  }

  parser = 'babel';

  renderModule(content: string, module: string): string {
    return `'@rothert/spbp/modules/${module}': ({ require }, exports) => {
      ${content}
    },`;
  }

  wrap(renderedContent: string, page?: string): string {
    const moduleMapFn = `
      {
        ${renderedContent}
      }
    `;
    if (page) {
      return `
        window.spbp.append(${moduleMapFn});
        window.spbp.require('@rothert/spbp/modules/page/${page}');
      `;
    }
    return `window.spbp = (function() {
      const loaded = new Map();
      const modules = ${moduleMapFn};
      return {
        require: function(module) {
          if (!loaded.has(module)) {
            if (!modules[module]) {
              throw new Error("Module " + module + " doesn't exist!");
            }
            let exports = {};
            modules[module](this, exports)
            loaded.set(module, exports)
          }
          return loaded.get(module);
        },
        loaded: loaded,
        modules: modules,
        append: function(modules) { Object.assign(this.modules, modules); }
      };
    })()
    `;
  }

}