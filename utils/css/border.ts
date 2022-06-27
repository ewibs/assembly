import { Border, BorderSide, SingleBorder } from "../../models/styles/border";
import { ModuleContext } from "./definitions";

function RenderSingleBorder(side: BorderSide, singleBorder: SingleBorder) {
  return `border-${side}: ${[
    singleBorder.width,
    singleBorder.style,
    singleBorder.color,
  ].filter(v => !!v).join(' ')};`;
}

export function RenderBorder(border: Border, context?: ModuleContext): string {
  return `
    ${Object.entries(border.sides || {}).map(([side, single]) => RenderSingleBorder(side as any, single as any)).join('\n')}
    ${Object.entries(border.radii || {}).map(([side, radius]) => `border-${side}-radius: ${radius};`).join('\n')}
    ${border.collapse ? `border-collapse: ${border.collapse};` : ''}
  `.trim();
}