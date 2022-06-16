import {
  IComponentMeta,
  ComponentBody,
} from "@ewibs/assembly/models/component";

export const meta: IComponentMeta = { name: "Button" };

export const styles: Partial<CSSStyleDeclaration> = {};

export const body: ComponentBody = {
  tagName: "button",
  text: "asdfff",
  identifier: "test-button",
  js: "console.log(element)",
  styles: { border: "1px solid red" },
};
