import fs from 'fs';
import { GlobSync, IGlobBase } from 'glob';
import path from 'path';
import { BehaviorSubject, filter, first, lastValueFrom, map, Observable, Subject, take, takeUntil } from 'rxjs';
import { Bundle } from './bundler';

import { AssemblyMode, IAssembly, IAssemblyData, IAssemblySettings, IPackage } from './models/assembly';
import { IComponent } from './models/component';
import globWatch from 'glob-watcher';
import { format } from 'prettier';
import parserBabel from "prettier/parser-babel";
import { Migrate } from './utils/component';

export abstract class Assembly implements IAssembly {

  private oldData?: Map<string, IComponent>;

  public readonly package: IPackage;
  public readonly settings: IAssemblySettings;
  private files?: IGlobBase;
  public components = new Map<string, IComponent>();
  public bundle?: Bundle;

  public readonly packagePath: string;
  private readonly absBasePath: string;
  private readonly absRootPath: string;
  private readonly absGlobPath: string;
  public readonly absOutPath: string;

  private readonly loadSubject = new BehaviorSubject<boolean>(false);
  private readonly watcher: fs.FSWatcher;
  public readonly $load: Observable<any> = this.loadSubject.asObservable();

  public mode = AssemblyMode.debug;

  constructor(public readonly assemblySettingsPath: string) {
    if (path.extname(assemblySettingsPath) !== '.ewibs') {
      throw new Error("ewibs assemblies can only be initialized by .ewibs files");
    }
    if (!fs.existsSync(this.assemblySettingsPath)) {
      throw new Error("ewibs assemblies settings file doesn't exist ");
    }
    
    this.packagePath = path.resolve(path.dirname(assemblySettingsPath), 'package.json');    

    if (!fs.existsSync(this.packagePath)) {
      throw new Error("ewibs assemblies require a package.json file");
    }

    this.package = JSON.parse(fs.readFileSync(this.packagePath, 'utf-8'));
    this.settings = JSON.parse(fs.readFileSync(this.assemblySettingsPath, 'utf-8'));
    
    this.absBasePath = path.dirname(this.packagePath);
    this.absRootPath = path.resolve(this.absBasePath, this.settings.root);
    this.absGlobPath = path.join(this.absRootPath, '**', '*.ts');
    this.absOutPath = path.join(this.absBasePath, this.settings.dist);
    
    this.watcher = globWatch([ this.absGlobPath, `!${this.absOutPath}` ])

    this.reload();
    this.watcher.on('change', () => this.reload());
    this.watcher.on('add', () => this.reload());
    this.watcher.on('unlink', () => this.reload());
  }

  validate() {
    // TODO: check if there are duplicate identifiers
  }

  applyChanges(data: IAssemblyData) {
    this.components = data.components;
  }

  save() {
    this.oldData?.forEach((component, identifier) => {
      if (this.components.has(identifier)) { return; }
      fs.rmSync(path.resolve(this.absRootPath, identifier + '.ts'))
    });
    this.components.forEach((component, key) => {
      const fullPath = path.resolve(this.absRootPath, key + '.ts');
      fs.mkdirSync(path.dirname(fullPath), { recursive: true });
      fs.writeFileSync(
        fullPath,
        format(`
          import { IComponentMeta, ComponentBody } from "@ewibs/assembly/models/component";

          export const meta: IComponentMeta = ${JSON.stringify(component.meta)}

          export const body: ComponentBody = ${JSON.stringify(component.body)}
        `, { parser: 'babel', plugins: [parserBabel] })
      );
    });
    fs.writeFileSync(this.assemblySettingsPath, JSON.stringify(this.settings), 'utf-8');
  }

  destroy() {
    this.watcher.close();
    this.components.forEach((_, file) => this.removeModuleFromCache(file))
  }

  abstract import(file: string): Promise<IComponent>;
  abstract removeModuleFromCache(file: string): Promise<void>;

  public getLoadPromise(): Promise<any> {
    return lastValueFrom(this.$load.pipe(filter(v => !!v), first()));
  }

  async getBundlePromise(): Promise<Bundle> {
    await this.getLoadPromise();
    return this.bundle!;
  }

  async reloadModule(file: string): Promise<IComponent> {
    await this.removeModuleFromCache(file);
    return Migrate(await this.import(file));
  }

  private cloneComps(): Map<string, IComponent> {
    return new Map<string, IComponent>(JSON.parse(JSON.stringify([...this.components.entries()])));
  }
  
  async reload() {
    console.log('Reloading assembly');

    this.files = new GlobSync(this.absGlobPath);
    this.components.clear();
    
    for (var file of this.files.found) {
      const identifier = path.relative(this.absRootPath, file).replace('.ts', '');
      this.components.set(identifier, await this.reloadModule(file));
    }

    this.bundle = new Bundle(this);

    this.validate();

    this.loadSubject.next(true);

    this.oldData = this.cloneComps();

    console.log('Finished reloading');
  }
}