import axios from 'axios'
import { user } from '../data/user'
import { getGoals } from './lib'
import { Goal } from './types'

jest.mock('axios')

const mockedAxios = axios as jest.Mocked<typeof axios>

describe('getGoals', () => {
  beforeEach(() => {
    mockedAxios.get.mockReset()
  })

  it('gets goals for the current user', async () => {
    const goals = [
      { id: 'goal-1', userId: user.id },
      { id: 'goal-2', userId: user.id },
    ] as Array<Goal & { userId: string }>
    mockedAxios.get.mockResolvedValue({ data: goals })

    const result = await getGoals()

    expect(mockedAxios.get).toHaveBeenCalledWith(
      `https://fencer-commbank.azurewebsites.net/api/Goal/User/${user.id}`,
    )
    expect(result).not.toBeNull()
    result?.forEach((goal) => {
      expect(goal).toEqual(expect.objectContaining({ userId: user.id }))
    })
  })

  it('returns null when getting goals fails', async () => {
    mockedAxios.get.mockRejectedValue(new Error('request failed'))

    await expect(getGoals()).resolves.toBeNull()
  })
})
