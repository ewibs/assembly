import {
  IComponentMeta,
  ComponentBody,
} from "@ewibs/assembly/models/component";

export const meta: IComponentMeta = {
  name: "asdf",
  io: {
    inputs: {
      text: {
        type: "string",
        delegation: [1, 2, "io.inputs.title"],
        default: "Delegated title",
      },
      test: { type: "string", delegation: ["text"], default: "" },
    },
  },
  page: {
    url: "about/test",
    styles: {
      mediaQueries: [
        {
          types: [{ type: "screen" }],
          features: [{ feature: "width", value: "500px" }],
          styles: { background: [{ color: "red" }] },
        },
      ],
      base: { background: [{ color: "green" }] },
    },
  },
};

export const body: ComponentBody = {
  text: "",
  children: [
    {
      tagName: "a",
      text: "Home",
      attributes: { href: "index.html" },
      styles: { base: {} },
      children: [
        { ref: "components/button", io: { inputs: {} } },
        { text: "Hello world" },
        { tagName: "blockquote", text: "Pipi" },
      ],
    },
    {
      tagName: "div",
      text: "asdf",
      children: [
        {
          tagName: "p",
          text: "asdfdeep",
          styles: { base: { background: [{ color: "green" }] } },
          children: [],
        },
        { ref: "components/title", io: { inputs: { title: "Custom title" } } },
        {
          ref: "components/title",
          io: { inputs: { title: "Delegated title" } },
        },
      ],
      styles: {
        base: {
          fontWeight: "bolder",
          background: [{ color: "yellow" }],
          display: "flex",
        },
      },
    },
    { ref: "components/button", io: { inputs: {} } },
    { ref: "components/button", io: { inputs: {} } },
  ],
  styles: { base: {} },
};
