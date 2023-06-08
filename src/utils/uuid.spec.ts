import { isValidUUID } from './uuid'

describe('Controller method isValidUUID', () => {
  test('should return true if uuid is valid', () => {
    // pattern xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx; y=8|9|A|B
    expect(isValidUUID('non-uuid')).toBe(false)
    expect(isValidUUID('')).toBe(false)
    expect(isValidUUID('00000000-0000-0000-0000-000000000000')).toBe(false)
    expect(isValidUUID('a2f43e3b-f0f640-fda6a7-dea5-45076333')).toBe(false)
    expect(isValidUUID('a2f43e3b-f0f6-40fd-a6a7-dea545076333')).toBe(true)
  })
})
