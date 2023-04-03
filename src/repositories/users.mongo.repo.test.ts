import { UserStructure } from '../entities/user.model';
import { UserModel } from './users.mongo.model';
import { UsersMongoRepo } from './users.mongo.repo';

jest.mock('./users.mongo.model.js');

describe('Given the repository UsersMongoRepo', () => {
  const repo = new UsersMongoRepo();

  const mockPopulateFunction = (mockPopulateValue: unknown) => ({
    populate: jest.fn().mockImplementation(() => ({
      exec: jest.fn().mockResolvedValue(mockPopulateValue),
    })),
  });

  describe('When the repository is instanced', () => {
    test('Then, the repo should be instance of UsersMongoRepo', () => {
      expect(repo).toBeInstanceOf(UsersMongoRepo);
    });
  });

  describe('When the read method is used', () => {
    test('Then it should return the mock result of the users', async () => {
      const mockPopulateValue = [{ id: '1' }, { id: '2' }];

      (UserModel.find as jest.Mock).mockImplementation(() =>
        mockPopulateFunction(mockPopulateValue)
      );

      const result = await repo.read();
      expect(result).toEqual([{ id: '1' }, { id: '2' }]);
    });
  });

  describe('When the readId method is used', () => {
    test('Then if the findById method resolve value to an object, it should return the object', async () => {
      const mockPopulateValue = { id: '1' };

      (UserModel.findById as jest.Mock).mockImplementation(() =>
        mockPopulateFunction(mockPopulateValue)
      );

      const result = await repo.readId('1');
      expect(UserModel.findById).toHaveBeenCalled();
      expect(result).toEqual({ id: '1' });
    });

    test('Then if the findById method resolve value to null, it should throw an Error', async () => {
      const mockPopulateValue = null;

      (UserModel.findById as jest.Mock).mockImplementation(() =>
        mockPopulateFunction(mockPopulateValue)
      );

      expect(async () => repo.readId('')).rejects.toThrow();
    });
  });

  describe('When the create method is used', () => {
    test('Then if there is a mock object to create, it should return the created object', async () => {
      (UserModel.create as jest.Mock).mockResolvedValue({ email: 'test' });

      const result = await repo.create({ email: 'test' });
      expect(result).toEqual({ email: 'test' });
    });
  });

  describe('When the update method is used', () => {
    const mockUser = {
      email: 'test',
    } as Partial<UserStructure>;

    test('Then if the findByIdAndUpdate method resolve value to an object, it should return the object', async () => {
      const mockPopulateValue = { email: 'test' };

      (UserModel.findByIdAndUpdate as jest.Mock).mockImplementation(() =>
        mockPopulateFunction(mockPopulateValue)
      );

      const result = await repo.update(mockUser);
      expect(result).toEqual({ email: 'test' });
    });

    test('Then if the findByIdAndUpdate method resolve value to null, it should throw an Error', async () => {
      const mockPopulateValue = null;

      (UserModel.findByIdAndUpdate as jest.Mock).mockImplementation(() =>
        mockPopulateFunction(mockPopulateValue)
      );

      expect(async () => repo.update(mockUser)).rejects.toThrow();
    });
  });

  describe('When the erase method is used', () => {
    let mockExecValue: unknown;
    const mockExec = () => ({
      exec: jest.fn().mockResolvedValue(mockExecValue),
    });

    test('Then if it has an object to erase with its ID, the findByIdAndDelete function should be called', async () => {
      mockExecValue = {};

      (UserModel.findByIdAndDelete as jest.Mock).mockImplementation(mockExec);
      await repo.erase('1');
      expect(UserModel.findByIdAndDelete).toHaveBeenCalled();
    });

    test('Then if the findByIdAndDelete method resolve value to undefined, it should throw an Error', async () => {
      mockExecValue = null;

      (UserModel.findByIdAndDelete as jest.Mock).mockImplementation(mockExec);
      expect(async () => repo.erase('')).rejects.toThrow();
    });
  });

  describe('When the search method is used', () => {
    test('Then if it has an mock query object, it should return find resolved value', async () => {
      const mockPopulateValue = [{ id: '1' }];

      (UserModel.find as jest.Mock).mockImplementation(() =>
        mockPopulateFunction(mockPopulateValue)
      );

      const mockQuery = { key: 'test', value: 'test' };
      const result = await repo.search(mockQuery);
      expect(result).toEqual([{ id: '1' }]);
    });
  });
});
