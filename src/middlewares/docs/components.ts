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
    },
    NewTotem: {
      required: ['localizacao', 'descricao'],
      properties: {
        localizacao: {
          type: 'string',
          example: 'localizacao x'
        },
        descricao: {
          type: 'string',
          example: 'descricao x'
        }
      }
    },
    Totem: {
      allOf: [{ $ref: '#/components/schemas/NewTotem' }],
      required: ['id'],
      properties: {
        id: {
          type: 'string',
          format: 'uuid',
          example: '65c3dc3d-ff7f-482c-b0f9-0758739f0a5f'
        }
      }
    },
    NewTranca: {
      required: ['totemId', 'numero', 'anoDeFabricacao', 'modelo'],
      properties: {
        totemId: {
          type: 'string',
          format: 'uuid',
          example: '65c3dc3d-ff7f-482c-b0f9-0758739f0a5f'
        },
        numero: {
          type: 'integer',
          example: 1
        },
        anoDeFabricacao: {
          type: 'string',
          example: '2023'
        },
        modelo: {
          type: 'string',
          example: 'modelo x'
        }
      }
    },
    Tranca: {
      allOf: [{ $ref: '#/components/schemas/NewTranca' }],
      required: ['id'],
      properties: {
        id: {
          type: 'string',
          format: 'uuid',
          example: '35a371ed-8bb7-4b30-8f4f-310f31c3f576'
        },
        bicicletaId: {
          type: 'string',
          format: 'uuid',
          example: 'a2f43e3b-f0f6-40fd-a6a7-dea545076333'
        },
        status: {
          type: 'string',
          example: 'disponivel',
          default: 'disponivel',
          enum: ['disponivel', 'em uso', 'em reparo']
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
    },
    idTotem: {
      in: 'path',
      name: 'id',
      schema: {
        type: 'string',
        format: 'uuid',
        example: '65c3dc3d-ff7f-482c-b0f9-0758739f0a5f'
      },
      description: 'ID do totem',
      required: true
    },
    idTranca: {
      in: 'path',
      name: 'id',
      schema: {
        type: 'string',
        format: 'uuid',
        example: '35a371ed-8bb7-4b30-8f4f-310f31c3f576'
      },
      description: 'ID da tranca',
      required: true
    }
  }
}
