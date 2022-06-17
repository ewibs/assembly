import {
  IComponentMeta,
  ComponentBody,
} from "@ewibs/assembly/models/component";

export const meta: IComponentMeta = { name: "Seperator" };

export const body: ComponentBody = {
  tagName: "hr",
  styles: { border: "1px solid red" },
  text: "asd",
};
