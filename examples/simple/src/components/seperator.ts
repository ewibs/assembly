import {
  IComponentMeta,
  ComponentBody,
} from "@ewibs/assembly/models/component";

export const meta: IComponentMeta = { name: "Seperator" };

export const body: ComponentBody = {
  tagName: "hr",
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
  text: "asd",
};
