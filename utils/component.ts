import { ComponentBody, IComponent, IComponentMeta } from '../models/component';

export function MigrateMeta(meta: IComponentMeta): IComponentMeta {
  return meta;
}

export function MigrateBody(body: ComponentBody): ComponentBody {
  if (body.children) {
    body.children = body.children.map(MigrateBody);
  }
  return body;
}

export function Migrate({ meta, body }: IComponent): IComponent {
  return {
    meta: MigrateMeta(meta),
    body: MigrateBody(body)
  }
}