// Define os componentes com schemas e parâmetros que serão utilizados em toda documentação da API
// https://swagger.io/docs/specification/components/

export const components = {
  schemas: {
    NewBicicleta: {
      required: ['modelo', 'marca', 'ano', 'numero'],
      properties: {
        modelo: {
          type: 'string',
          example: 'modelo x'
        },
        marca: {
          type: 'string',
          example: 'marca x'
        },
        ano: {
          type: 'string',
          example: '2023'
        },
        numero: {
          type: 'integer',
          example: 1
        },
        status: {
          type: 'string',
          example: 'disponivel',
          default: 'disponivel',
          enum: ['disponivel', 'em uso', 'em reparo']
        }
      }
    },
    Bicicleta: {
      allOf: [{ $ref: '#/components/schemas/NewBicicleta' }],
      required: ['id'],
      properties: {
        id: {
          type: 'string',
          format: 'uuid',
          example: 'a2f43e3b-f0f6-40fd-a6a7-dea545076333'
        }
      }
    }
  },
  parameters: {
    idBicicleta: {
      in: 'path',
      name: 'id',
      schema: {
        type: 'string',
        format: 'uuid',
        example: 'a2f43e3b-f0f6-40fd-a6a7-dea545076333'
      },
      description: 'ID da bicicleta',
      required: true
    }
  }
}
