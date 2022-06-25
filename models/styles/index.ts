import { StyleDeclarations } from './declarations';
import { MediaQuery } from './media';

export type Styles = {
  mediaQueries?: MediaQuery[];
  base: StyleDeclarations;
};