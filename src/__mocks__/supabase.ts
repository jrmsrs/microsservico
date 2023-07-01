const select = jest.fn(() => ({
  data: [],
  error: null
}))

const eq = jest.fn(() => ({
  select
}))

export const createClient = jest.fn(() => ({
  from: jest.fn(() => ({
    select: jest.fn(() => ({
      data: [],
      error: null,
      eq
    })),
    insert: jest.fn(() => ({
      select
    })),
    update: jest.fn(() => ({
      eq
    })),
    delete: jest.fn(() => ({
      eq
    }))
  }))
}))
