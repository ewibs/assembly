import { StyleAttribute } from './attributes';
import { Background } from './background';
import { Spacings } from './spacings';
import { Text } from './text';

export type StyleDeclarations = Partial<Pick<CSSStyleDeclaration, StyleAttribute> & {
  background: Background[];
  spacings: Spacings;
  text: Text;
}>;