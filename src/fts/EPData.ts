import { Buffer } from 'node:buffer'
import { BinaryIO } from '../binary/BinaryIO'

export type ArxEPData = {
  px: number
  py: number
  idx: number
}

export class EPData {
  static readFrom(binary: BinaryIO) {
    const [px, py, idx] = binary.readInt16Array(4)
    return { px, py, idx } as ArxEPData
  }

  static accumulateFrom({ px, py, idx }: ArxEPData) {
    const buffer = Buffer.alloc(EPData.sizeOf())
    const binary = new BinaryIO(buffer.buffer)

    binary.writeInt16Array([px, py, idx, 0])

    return buffer
  }

  static sizeOf() {
    return 4 * 2
  }
}