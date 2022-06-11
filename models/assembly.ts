import { IComponent } from "./component";

export interface IAssemblyDefinitions {
  root: string;
  dist: string;
}

export interface IPackage {
  version: string;
  description: string;
  spbp: IAssemblyDefinitions;
}

export enum AssemblyMode { 
  prod = 'prod',
  debug = 'debug'
}

export interface IAssemblyData {
  readonly components: Map<string, IComponent>;
  mode: AssemblyMode;
  packagePath: string;
}

export interface IAssembly extends IAssemblyData {
  readonly meta: IPackage;
  readonly absOutPath: string;
}