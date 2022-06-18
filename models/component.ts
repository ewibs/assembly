import { IO, IORefValueMap } from './io';
import { Styles } from './styles';

export type Primitive = string | boolean | number | undefined;
export type UnionToType<U extends Record<string, unknown>> = { [K in (U extends unknown ? keyof U : never)]: U extends unknown ? K extends keyof U ? U[K] : never : never }

export type PageMeta = { url: string; } & Partial<TagComponentCSS>;

export interface IComponentMeta {
  name: string;
  io?: IO;
  page?: PageMeta;
}

export const UnwrappableHTMLTags = ['input', 'hr', 'br'] as const;
export type NoWrapHTMLElementTag = (typeof UnwrappableHTMLTags)[number];
export type WrapHTMLElementTag = Exclude<keyof HTMLElementTagNameMap, NoWrapHTMLElementTag>;

export type TextComponentBody = {
  text?: string;
  children?: ComponentBody[];
}

export type RefComponentBody = {
  io: IORefValueMap;
  ref: string;
  children?: ComponentBody[];
}

export type TagComponentJS = {
  identifier: string,
  js: string,
};

export type TagComponentCSS = {
  styles: Styles,
};

// SHOULD DEFINETLY NOT BE ANY BUT TS IS SO FUCKING CONFUSING
type PrimitiveList<Type> = { [pups in Exclude<keyof Type, 'toString'>]?: Primitive }

export type ComponentBodyGeneric<TagName> = TagName extends NoWrapHTMLElementTag | WrapHTMLElementTag ? (
  {
    tagName: TagName,
    attributes?: PrimitiveList<
      Exclude<HTMLElementTagNameMap[TagName],
        ComponentBodyGeneric<TagName>>
    >,
    identifier?: string,
    styles?: Styles,
    js?: string,
    text?: string,
    children?: (ComponentBody)[],
  }
  // TODO: this should be more controlled, for example if js is there it should require an identifier
) : never;

export type WrapTagComponentBody = ComponentBodyGeneric<NoWrapHTMLElementTag>;
export type NoWrapTagComponentBody = ComponentBodyGeneric<NoWrapHTMLElementTag>;
export type TagComponentBody = WrapTagComponentBody | NoWrapTagComponentBody;

export type ComponentBody = { editor?: { name: string; } } & (RefComponentBody | TextComponentBody | ComponentBodyGeneric<NoWrapHTMLElementTag> | ComponentBodyGeneric<WrapHTMLElementTag>);
export type NoRefComponentBody = Exclude<ComponentBody, RefComponentBody>;

export interface IComponent {
  meta: IComponentMeta;
  body: ComponentBody;
}