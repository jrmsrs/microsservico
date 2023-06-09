// Define os componentes com schemas e parâmetros que serão utilizados em toda documentação da API
// https://swagger.io/docs/specification/components/
import { status as statusBicicleta } from '../../enums/statusBicicletaEnum'
import { status as statusTranca } from '../../enums/statusTrancaEnum'

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
        }
      }
    },
    Bicicleta: {
      allOf: [{ $ref: '#/components/schemas/NewBicicleta' }],
      required: ['id'],
      properties: {
        id: {
          type: 'integer',
          example: 1,
          minimum: 1
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
          type: 'integer',
          example: 1,
          minimum: 1
        }
      }
    },
    NewTranca: {
      required: ['totemId', 'numero', 'anoDeFabricacao', 'modelo'],
      properties: {
        totemId: {
          type: 'integer',
          example: 1,
          minimum: 1
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
          type: 'integer',
          example: 1,
          minimum: 1
        },
        bicicletaId: {
          type: 'integer',
          example: 1,
          minimum: 1
        }
      }
    },
    IntegrarBicicletaRede: {
      required: ['bicicletaId', 'trancaId', 'funcionarioId'],
      properties: {
        bicicletaId: {
          type: 'integer',
          example: 1,
          minimum: 1
        },
        trancaId: {
          type: 'integer',
          example: 1,
          minimum: 1
        },
        funcionarioId: {
          type: 'integer',
          example: 1,
          minimum: 1
        }
      }
    },
    RetirarBicicletaRede: {
      required: ['statusAcaoReparador'],
      allOf: [{ $ref: '#/components/schemas/IntegrarBicicletaRede' }],
      properties: {
        statusAcaoReparador: {
          type: 'string',
          example: statusBicicleta.EM_REPARO,
          default: statusBicicleta.EM_REPARO,
          enum: [statusBicicleta.EM_REPARO, statusBicicleta.APOSENTADA]
        }
      }
    },
    IntegrarTrancaRede: {
      required: ['totemId', 'trancaId', 'funcionarioId'],
      properties: {
        trancaId: {
          type: 'integer',
          example: 1,
          minimum: 1
        },
        totemId: {
          type: 'integer',
          example: 1,
          minimum: 1
        },
        funcionarioId: {
          type: 'integer',
          example: 1,
          minimum: 1
        }
      }
    },
    RetirarTrancaRede: {
      required: ['statusAcaoReparador'],
      allOf: [{ $ref: '#/components/schemas/IntegrarTrancaRede' }],
      properties: {
        statusAcaoReparador: {
          type: 'string',
          example: statusTranca.EM_REPARO,
          default: statusTranca.EM_REPARO,
          enum: [statusTranca.EM_REPARO, statusTranca.APOSENTADA]
        }
      }
    },
    Trancar: {
      required: ['bicicletaId'],
      properties: {
        bicicletaId: {
          type: 'integer',
          example: 1,
          minimum: 1
        }
      }
    },
    Destrancar: {
      allOf: [{ $ref: '#/components/schemas/Trancar' }]
    }
  },
  parameters: {
    idBicicleta: {
      in: 'path',
      name: 'id',
      schema: {
        type: 'integer',
        example: 1,
        minimum: 1
      },
      description: 'ID da bicicleta',
      required: true
    },
    idTotem: {
      in: 'path',
      name: 'id',
      schema: {
        type: 'integer',
        example: 1,
        minimum: 1
      },
      description: 'ID do totem',
      required: true
    },
    idTranca: {
      in: 'path',
      name: 'id',
      schema: {
        type: 'integer',
        example: 1,
        minimum: 1
      },
      description: 'ID da tranca',
      required: true
    },
    bicicletaStatus: {
      in: 'path',
      name: 'statusAcao',
      schema: {
        type: 'string',
        example: statusBicicleta.REPARO_SOLICITADO,
        default: statusBicicleta.REPARO_SOLICITADO
      },
      description: 'status da bicicleta',
      required: true
    },
    trancaStatus: {
      in: 'path',
      name: 'statusAcao',
      schema: {
        type: 'string',
        example: statusTranca.APOSENTADA,
        default: statusTranca.APOSENTADA
      },
      description: 'status da tranca',
      required: true
    }
  }
}
