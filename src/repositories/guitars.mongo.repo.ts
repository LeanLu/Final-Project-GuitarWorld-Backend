import { GuitarStructure } from '../entities/guitar.model';
import { HTTPError } from '../errors/errors.js';
import { Repo } from './repo.interface';
import { GuitarModel } from './guitars.mongo.model.js';
import createDebug from 'debug';

const debug = createDebug('GW:guitars-repo');

export class GuitarsMongoRepo implements Repo<GuitarStructure> {
  constructor() {
    debug('guitars-repo-instanced');
  }

  async read(): Promise<GuitarStructure[]> {
    debug('read-method');
    const data = await GuitarModel.find().exec();
    return data;
  }

  async readId(id: string): Promise<GuitarStructure> {
    debug('readID-method');
    const data = await GuitarModel.findById(id).exec();
    if (!data) throw new HTTPError(404, 'Not found', 'ID not found in readID');
    return data;
  }

  async create(guitar: Partial<GuitarStructure>): Promise<GuitarStructure> {
    debug('create-method');
    const data = await GuitarModel.create(guitar);
    return data;
  }

  async update(guitar: Partial<GuitarStructure>): Promise<GuitarStructure> {
    debug('update-method');
    const data = await GuitarModel.findByIdAndUpdate(guitar.id, guitar, {
      new: true,
    }).exec();
    if (!data) throw new HTTPError(404, 'Not found', 'ID not found in update');
    return data;
  }

  async erase(id: string): Promise<void> {
    debug('erase-method');
    const data = await GuitarModel.findByIdAndDelete(id).exec();
    if (!data)
      throw new HTTPError(
        404,
        'Not found',
        'Delete not possible: ID not found'
      );
  }

  async search(query: { key: string; value: unknown }) {
    debug('search-method');
    const data = await GuitarModel.find({ [query.key]: query.value }).exec();
    return data;
  }
}
