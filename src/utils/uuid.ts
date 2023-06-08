// Pattern regex para validar UUID
// Referência: https://stackoverflow.com/a/38191078

export const isValidUUID = (str: string): boolean => {
  const uuidRegex = /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i
  return uuidRegex.test(str)
}
