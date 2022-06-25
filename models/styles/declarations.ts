import { Alignment } from './alignment';
import { StyleAttribute } from './attributes';
import { Background } from './background';
import { Border } from './border';
import { Spacings } from './spacings';
import { Text } from './text';

export type StyleDeclarations = Partial<Pick<CSSStyleDeclaration, StyleAttribute> & {
  background: Background[];
  spacings: Spacings;
  text: Text;
  border: Border;
  alignment: Alignment;
}>;