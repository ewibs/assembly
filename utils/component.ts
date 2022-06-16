import { IComponent, ComponentBody, IComponentMeta, TagComponentBody } from "../models/component";

export function MigrateMeta(meta: IComponentMeta): IComponentMeta {
  return meta;
}

export function MigrateStyles(styles?: Partial<CSSStyleDeclaration>): Partial<CSSStyleDeclaration> {
  return styles || {};
}

export function MigrateBody(body: ComponentBody): ComponentBody {
  if (body.children) {
    body.children = body.children.map(MigrateBody);
  }
  return body;
}

export function Migrate({ meta, body, styles }: IComponent): IComponent {
  return {
    meta: MigrateMeta(meta),
    styles: MigrateStyles(styles),
    body: MigrateBody(body)
  }
}