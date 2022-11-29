import { Buffer } from 'node:buffer'
import { BinaryIO } from '../binary/BinaryIO'
import { repeat } from '../common/helpers'
import { ArxVector3 } from '../common/types'

export type ArxPathway = {
  rpos: ArxVector3
  flag: number
  time: number
}

export class Pathway {
  static readFrom(binary: BinaryIO) {
    const data: ArxPathway = {
      rpos: binary.readVector3(),
      flag: binary.readInt32(),
      time: binary.readUint32(),
    }

    binary.readFloat32Array(2) // fpad
    binary.readInt32Array(2) // lpad
    binary.readUint8Array(32) // cpad

    return data
  }

  static allocateFrom(pathway: ArxPathway) {
    const buffer = Buffer.alloc(Pathway.sizeOf())
    const binary = new BinaryIO(buffer.buffer)

    binary.writeVector3(pathway.rpos)
    binary.writeInt32(pathway.flag)
    binary.writeUint32(pathway.time)

    binary.writeFloat32Array(repeat(0, 2))
    binary.writeInt32Array(repeat(0, 2))
    binary.writeUint8Array(repeat(0, 32))

    return buffer
  }

  static sizeOf() {
    return 3 * 4 + 4 + 4 + 2 * 4 + 2 * 4 + 32
  }
}