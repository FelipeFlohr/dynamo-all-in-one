import DynamoBinary from '../lib/models/DynamoBinary'
import { objectToDynamo } from '../lib/utils/realToDynamoTypes'

// eslint-disable-next-line no-undef
test('Object is being converted to the AWS API type', () => {
  const obj = {
    nome: 'John Doe'
  }
  const objBinary = {
    nome: 'John Doe',
    bin: new DynamoBinary('John Doe')
  }

  const res1 = objectToDynamo(obj)
  const res2 = objectToDynamo(objBinary)

  expect(res1).toStrictEqual({
    nome: {
      S: 'John Doe'
    }
  })
  expect(res2).toStrictEqual({
    nome: {
      S: 'John Doe'
    },
    bin: {
      B: 'Sm9obiBEb2U='
    }
  })
})
