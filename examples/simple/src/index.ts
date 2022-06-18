import {
  IComponentMeta,
  ComponentBody,
} from "@ewibs/assembly/models/component";

export const meta: IComponentMeta = { name: "asdf", page: { url: "index" } };

export const body: ComponentBody = {
  text: "Hello world",
  children: [
    {
      tagName: "a",
      text: "asdf",
      attributes: { href: "about.html" },
      styles: { base: { color: "blue" } },
    },
    {
      tagName: "p",
      text: "asdf",
      children: [{ ref: "components/button", io: { inputs: {} } }],
      styles: { base: { color: "red" } },
    },
    { ref: "components/button", io: { inputs: {} } },
  ],
};
