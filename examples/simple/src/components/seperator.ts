import {
  IComponentMeta,
  ComponentBody,
} from "@ewibs/assembly/models/component";

export const meta: IComponentMeta = { name: "Seperator" };

export const body: ComponentBody = {
  tagName: "hr",
  styles: { base: { border: "1px solid red" } },
  text: "asd",
};
