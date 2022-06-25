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
      styles: { base: { text: { color: "blue" } } },
    },
    {
      tagName: "p",
      text: "asdf",
      children: [{ ref: "components/button", io: { inputs: {} } }],
      styles: {
        base: {
          text: { color: "red" },
          spacings: {
            positionType: 'fixed',
            position: { left: '12px', right: '14px', bottom: '16px', top: '20px' },
            padding: { left: '10px', right: '10px', bottom: '10px', top: '10px' },
            margin: { left: '10px', bottom: '140px' },
            size: { width: '140px', height: '40px' }
          }
        }
      },
    },
    { ref: "components/button", io: { inputs: {} } },
  ],
};
