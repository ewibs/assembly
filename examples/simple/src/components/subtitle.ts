import {
  IComponentMeta,
  ComponentBody,
} from "@ewibs/assembly/models/component";

export const meta: IComponentMeta = {
  name: "Subtitle",
  io: {
    inputs: {
      subtitle: {
        type: "string",
        delegation: ["text"],
        default: "The subtitle",
      },
    },
  },
};

export const body: ComponentBody = {
  editor: { name: "subtitle" },
  tagName: "h3",
  text: "Delegated title",
  styles: {
    base: {
      border: {
        sides: {
          bottom: {
            width: '1px',
            style: 'solid',
            color: 'black'
          }
        }
      }
    }
  },
};
