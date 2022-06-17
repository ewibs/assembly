import {
  IComponentMeta,
  ComponentBody,
} from "@ewibs/assembly/models/component";

export const meta: IComponentMeta = {
  name: "Title",
  io: {
    inputs: {
      title: {
        type: "string",
        delegation: [0, "io.inputs.subtitle"],
        default: "Dis da title",
      },
    },
  },
};

export const body: ComponentBody = {
  editor: { name: "pipi" },
  tagName: "h1",
  text: "",
  styles: { border: "1px solid green" },
  children: [
    {
      ref: "components/subtitle",
      io: { inputs: { subtitle: "Delegated title" } },
    },
  ],
};
