import { IFontFace } from 'utils/font-face';
import { IComponent } from './component';
import { Styles } from './styles';

export interface IAssemblyDefinitions {
}

export interface IPackage {
  version: string;
  description: string;
}

export interface IAssemblySettings {
  root: string;
  dist: string;
  assets: string;
  globalStyle: {
    normalize: boolean;
    styles: Styles;
    fontFaces: IFontFace[]
  };
}

export enum AssemblyMode { 
  prod = 'prod',
  debug = 'debug'
}

export interface IAssemblyData {
  readonly components: Map<string, IComponent>;
  mode: AssemblyMode;
  packagePath: string;
  readonly settings: IAssemblySettings;
}

export interface IAssembly extends IAssemblyData {
  readonly package: IPackage;
  readonly absOutPath: string;
  readonly absAssetsPath: string;
}