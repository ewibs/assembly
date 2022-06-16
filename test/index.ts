import path from 'path';

import { Assembly } from '../assembly';
import { IComponent } from '../models/component';

const baseUrl = path.resolve(__dirname, '../examples/simple/simple.ewibs');

class TestAssembly extends Assembly {

  async removeModuleFromCache(file: string): Promise<void> {
    // throw new Error('Method not implemented.');
  }

  async import(file: string): Promise<IComponent> {
    return await import(file);
  }
}

const assembly = new TestAssembly(baseUrl);

assembly.getBundlePromise().then(bundle => {
  bundle.export();
  assembly.save();
});