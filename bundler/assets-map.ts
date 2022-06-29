import fs from 'fs';
import path from 'path';
import { IBundleContext } from "./compile";

export type Asset = {
  file: NodeJS.ArrayBufferView;
  abs: string;
  rel: string;
}

export class AssetsMap {

  private assetsPath: string;

  public readonly assets = new Map<string, Asset>();

  constructor(public readonly context: IBundleContext) {
    this.assetsPath = context.assembly.absAssetsPath;
  }

  private resolveAssetPath(file: string): string {
    return path.resolve(this.assetsPath, file.startsWith('/') ? file.slice(1) : file);
  }

  private findAsset(file: string): Asset {
    if (!this.assets.has(file)) {
      const abs = this.resolveAssetPath(file)
      if (!fs.existsSync(this.resolveAssetPath(file))) {
        throw new Error(`File '${this.resolveAssetPath(file)}' not found!`);
      }
      this.assets.set(file, {
        abs,
        file: fs.readFileSync(abs),
        rel: `assets/${file.startsWith('/') ? file.slice(1) : file}`
      });
    }
    return this.assets.get(file)!;
  }

  resolve(file: string): string {
    const [source, path] = file.split(':/');
    switch (source) {
      case 'assets': return this.findAsset(path).rel;
      default: return file;
    }
  }
}