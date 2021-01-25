import faker from 'faker'
import { DbLoadTodo } from './db-load-todo'
import { LoadTodoRepository } from '@/data/protocols'
import { Todo } from '@/domain/models'
import { LoadTodo } from '@/domain/usecases'

let id: any, title: any, description: any, date: Date, active: boolean

const mockListTodo = (): Todo[] => {
  return [{
    id,
    title,
    description,
    date,
    active
  }]
}

const mockLoadTodoRepository = (): LoadTodoRepository => {
  class LoadTodoRepositoryStub implements LoadTodoRepository {
    async loadAll (): Promise<LoadTodo.Result> {
      return mockListTodo()
    }
  }
  return new LoadTodoRepositoryStub()
}

type SutTypes = {
  sut: DbLoadTodo
  loadTodoRepository: LoadTodoRepository
}

const makeSut = (): SutTypes => {
  const loadTodoRepository = mockLoadTodoRepository()
  const sut = new DbLoadTodo(loadTodoRepository)
  return {
    sut,
    loadTodoRepository
  }
}

describe('DbLoadTodo Usecase', () => {
  beforeEach(() => {
    id = faker.random.uuid()
    title = faker.random.word()
    description = faker.random.words()
    date = faker.date.recent()
    active = faker.random.boolean()
  })

  it('Shoudl call LoadTodoRepository with correct password', async () => {
    const { sut, loadTodoRepository } = makeSut()
    const loadTodoSpy = jest.spyOn(loadTodoRepository, 'loadAll')
    await sut.loadAll()
    expect(loadTodoSpy).toHaveBeenCalled()
  })

  it('Shoudl throw if LoadTodoRepository throws', async () => {
    const { sut, loadTodoRepository } = makeSut()
    jest.spyOn(loadTodoRepository, 'loadAll').mockImplementationOnce(() => { throw new Error() })
    const httpResponse = sut.loadAll()
    await expect(httpResponse).rejects.toThrow()
  })

  it('Shoudl return all todos on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.loadAll()
    expect(httpResponse).toEqual(mockListTodo())
  })
})