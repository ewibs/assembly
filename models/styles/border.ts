export type SingleBorder = {
  color: string;
  style: 'dotted' | 'solid' | 'dashed';
  width: string;
}

export type BorderSide = 'left' | 'top' | 'bottom' | 'right';

export type Border = Partial<{
  radii: {
    ['top-left']?: string;
    ['top-right']?: string;
    ['bottom-left']?: string;
    ['bottom-right']?: string;
  };
  sides: { [key in BorderSide]?: Partial<SingleBorder> };
  collapse: string;
  // Image
  // ImageOutset
  // ImageRepeat
  // ImageSlice
  // ImageSource
  // ImageWidth
}>;
// 'border',
// 'borderBlock',
// 'borderBlockColor',
// 'borderBlockEnd',
// 'borderBlockEndColor',
// 'borderBlockEndStyle',
// 'borderBlockEndWidth',
// 'borderBlockStart',
// 'borderBlockStartColor',
// 'borderBlockStartStyle',
// 'borderBlockStartWidth',
// 'borderBlockStyle',
// 'borderBlockWidth',
// 'borderBottom',
// 'borderBottomColor',
// 'borderBottomLeftRadius',
// 'borderBottomRightRadius',
// 'borderBottomStyle',
// 'borderBottomWidth',
// 'borderCollapse',
// 'borderColor',
// 'borderEndEndRadius',
// 'borderEndStartRadius',
// 'borderImage',
// 'borderImageOutset',
// 'borderImageRepeat',
// 'borderImageSlice',
// 'borderImageSource',
// 'borderImageWidth',
// 'borderInline',
// 'borderInlineColor',
// 'borderInlineEnd',
// 'borderInlineEndColor',
// 'borderInlineEndStyle',
// 'borderInlineEndWidth',
// 'borderInlineStart',
// 'borderInlineStartColor',
// 'borderInlineStartStyle',
// 'borderInlineStartWidth',
// 'borderInlineStyle',
// 'borderInlineWidth',
// 'borderLeft',
// 'borderLeftColor',
// 'borderLeftStyle',
// 'borderLeftWidth',
// 'borderRadius',
// 'borderRight',
// 'borderRightColor',
// 'borderRightStyle',
// 'borderRightWidth',
// 'borderSpacing',
// 'borderStartEndRadius',
// 'borderStartStartRadius',
// 'borderStyle',
// 'borderTop',
// 'borderTopColor',
// 'borderTopLeftRadius',
// 'borderTopRightRadius',
// 'borderTopStyle',
// 'borderTopWidth',
// 'borderWidth',
