import { Buffer } from 'node:buffer'
import { BinaryIO } from '../common/BinaryIO'
import { DANAE_VERSION } from '../common/constants'
import { repeat } from '../common/helpers'
import { ArxLLF } from './LLF'

/** @see https://github.com/arx/ArxLibertatis/blob/1.2.1/src/scene/LevelFormat.h#L178 */
export type ArxLlfHeader = {
  lastUser: string
  time: number
  numberOfLights: number
  numberOfShadowPolygons: number
  numberOfIgnoredPolygons: number
  numberOfBackgroundPolygons: number
}

export class LlfHeader {
  static readFrom(binary: BinaryIO) {
    binary.readFloat32() // version - always 1.44
    binary.readString(16) // identifier - always DANAE_LLH_FILE

    const data: ArxLlfHeader = {
      lastUser: binary.readString(256),
      time: binary.readInt32(),
      numberOfLights: binary.readInt32(),
      numberOfShadowPolygons: binary.readInt32(),
      numberOfIgnoredPolygons: binary.readInt32(),
      numberOfBackgroundPolygons: binary.readInt32(),
    }

    binary.readInt32Array(256) // pad
    binary.readFloat32Array(256) // fpad
    binary.readString(4096) // cpad
    binary.readInt32Array(256) // bpad

    return data
  }

  static accumulateFrom(json: ArxLLF) {
    const buffer = Buffer.alloc(LlfHeader.sizeOf())
    const binary = new BinaryIO(buffer.buffer)

    binary.writeFloat32(DANAE_VERSION)
    binary.writeString('DANAE_LLH_FILE', 16)
    binary.writeString(json.header.lastUser, 256)
    binary.writeInt32(json.header.time)

    binary.writeInt32(json.lights.length)

    binary.writeInt32(json.header.numberOfShadowPolygons)
    binary.writeInt32(json.header.numberOfIgnoredPolygons)
    binary.writeInt32(json.header.numberOfBackgroundPolygons)

    binary.writeInt32Array(repeat(0, 256))
    binary.writeFloat32Array(repeat(0, 256))
    binary.writeString('', 4096)
    binary.writeInt32Array(repeat(0, 256))

    return buffer
  }

  static sizeOf() {
    return (
      BinaryIO.sizeOfFloat32() +
      BinaryIO.sizeOfString(16 + 256) +
      BinaryIO.sizeOfInt32Array(5 + 256) +
      BinaryIO.sizeOfFloat32Array(256) +
      BinaryIO.sizeOfString(4096) +
      BinaryIO.sizeOfInt32Array(256)
    )
  }
}
