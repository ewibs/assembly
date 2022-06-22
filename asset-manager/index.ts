import fs from 'fs';
import { GlobSync, IGlobBase } from 'glob';
import globWatch from 'glob-watcher';
import path from 'path';
import { Assembly } from "assembly";
import { map, startWith, Subject } from 'rxjs';

export interface IAssetTree {
  [key: string]: string | IAssetTree;
}

export class AssetManager {

  private readonly watcher: fs.FSWatcher;

  private files: IAssetTree = {};
  private changeSubject = new Subject();
  public $files = this.changeSubject.pipe(
    startWith(this.files),
    map(() => this.files),
  );

  constructor(private readonly assembly: Assembly) {

    this.watcher = globWatch([`${assembly.absAssetsPath}/**/*`])

    this.reload();
    this.watcher.on('change', () => this.reload());
    this.watcher.on('add', () => this.reload());
    this.watcher.on('unlink', () => this.reload());
  }

  private reload() {

    const sync = new GlobSync(`${this.assembly.absAssetsPath}/**/*`);
    this.files = {};

    const that = this; // needed for eval

    for (var file of sync.found) {
      const fileIsPath = fs.lstatSync(file).isDirectory() 
      const fileRel = path.relative(this.assembly.absAssetsPath, file);
      fileRel.split('/').forEach((_, index, all) => {
        const isFile = index === all.length - 1 && !fileIsPath;
        const sel = `that.files${all.slice(0, index + 1).map(v => `['${v}']`).join('')}`;
        eval(!isFile ? `if (!${sel}) { ${sel} = {} }` : `${sel} = '${fileRel}'`);
      });
    }

    this.changeSubject.next(null);
    
  }

}