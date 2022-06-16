import { BuiltInParserName, CustomParser, format, LiteralUnion } from "prettier";
import parserBabel from "prettier/parser-babel";
import parserCss from "prettier/parser-postcss";
import { IBundleContext } from "./compile";

export abstract class ModuleMap<T> {
  protected readonly map = new Map<string, {
    usedByPages: Set<string>,
    content: T
  }>();

  add(page: string, module: string, content: T) {
    if (this.map.has(module)) {
      this.map.get(module)?.usedByPages.add(page)
    } else {
      this.map.set(module, {
        usedByPages: new Set<string>([page]),
        content
      });
    }
  }

  abstract parser?: LiteralUnion<BuiltInParserName, string> | CustomParser;
  abstract renderModule(content: T, module: string): string;
  abstract wrap(renderedContent: string, page?: string): string;
  abstract readonly context: IBundleContext;
  
  renderModules(modules: string[], page?: string): string {
    return format(
      this.wrap(
        modules.map(module => {
          if (!this.map.has(module)) {
            return `/* Coudln't find module '${module}' */`;
          }
          const { usedByPages, content } = this.map.get(module)!;
          return this.renderModule(content, module);
        }).join('\n'),
        page
      ), { parser: this.parser, plugins: [parserBabel, parserCss] }
    );
  }
  
  renderForPage(page: string): string | undefined {
    const relevantModules = [...this.map.keys()]
      .filter(module => {
        const { usedByPages } = this.map.get(module)!;
        return usedByPages.size == 1 && [...usedByPages][0] == page;
      });
    if (!relevantModules) { return undefined; }
    return this.renderModules(relevantModules, page);
  }

  renderGlobal(): string {
    return this.renderModules(
      [...this.map.keys()]
      .filter(module => this.map.get(module)!.usedByPages.size > 1)
    );
  }
}