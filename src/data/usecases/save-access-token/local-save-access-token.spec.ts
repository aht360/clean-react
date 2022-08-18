import { SetStorageMock } from '@/data/test';
import faker from '@faker-js/faker';
import { LocalSaveAccessToken } from './local-save-access-token';

type SutTypes = {
    sut: LocalSaveAccessToken,
    setStorageSpy: SetStorageMock
}

const makeSut = (): SutTypes => {
    const setStorageSpy = new SetStorageMock()
    const sut = new LocalSaveAccessToken(setStorageSpy);

    return {
        sut,
        setStorageSpy
    }
}

describe('LocalSaveAccessToken', () => {
    test('Shoud call SetStorage with correct value', async () => {
        const { sut, setStorageSpy } = makeSut();

        const accessToken = faker.datatype.uuid();

        await sut.save(accessToken);

        expect(setStorageSpy.key).toBe('accessToken');
        expect(setStorageSpy.value).toBe(accessToken);
    })

    test('Shoud throw if SetStorage throws', async () => {
        const { sut, setStorageSpy } = makeSut();

        jest.spyOn(setStorageSpy, 'set').mockRejectedValueOnce(new Error())

        const promise = sut.save(faker.datatype.uuid());

        await expect(promise).rejects.toThrow(new Error());
    })
})
