import { Buffer } from 'node:buffer'
import { BinaryIO } from '../binary/BinaryIO'
import { repeat } from '../common/helpers'
import { ArxRotation, ArxVector3 } from '../common/types'
import { ArxDLF } from './DLF'

export type ArxDlfHeader = {
  version: number
  identifier: string
  lastUser: string
  time: number
  posEdit: ArxVector3
  angleEdit: ArxRotation
  hasScene: boolean
  numberOfInteractiveObjects: number
  numberOfNodes: number
  numberOfNodeLinks: number
  numberOfZones: number
  numberOfLights: number
  numberOfFogs: number
  numberOfBackgroundPolygons: number
  numberOfIgnoredPolygons: number
  numberOfChildPolygons: number
  numberOfPaths: number
  offset: ArxVector3
}

export class DlfHeader {
  static readFrom(binary: BinaryIO): ArxDlfHeader {
    const dataBlock1 = {
      version: binary.readFloat32(),
      identifier: binary.readString(16),
      lastUser: binary.readString(256),
      time: binary.readInt32(),
      posEdit: binary.readVector3(),
      angleEdit: binary.readRotation(),
      hasScene: binary.readInt32() > 0,
      numberOfInteractiveObjects: binary.readInt32(),
      numberOfNodes: binary.readInt32(),
      numberOfNodeLinks: binary.readInt32(),
      numberOfZones: binary.readInt32(),
    }

    binary.readInt32() // lighting - we don't parse it as it's 0 in all the levels
    binary.readInt32Array(256) // Bpad

    const dataBlock2 = {
      numberOfLights: binary.readInt32(),
      numberOfFogs: binary.readInt32(),
      numberOfBackgroundPolygons: binary.readInt32(),
      numberOfIgnoredPolygons: binary.readInt32(),
      numberOfChildPolygons: binary.readInt32(),
      numberOfPaths: binary.readInt32(),
    }

    binary.readInt32Array(250) // pad

    const dataBlock3 = {
      offset: binary.readVector3(),
    }

    binary.readFloat32Array(253) // fpad
    binary.readString(4096) // cpad
    binary.readInt32Array(256) // bpad

    return {
      ...dataBlock1,
      ...dataBlock2,
      ...dataBlock3,
    }
  }

  static accumulateFrom(json: ArxDLF) {
    const buffer = Buffer.alloc(DlfHeader.sizeOf())
    const binary = new BinaryIO(buffer.buffer)

    binary.writeFloat32(json.header.version)
    binary.writeString(json.header.identifier, 16)
    binary.writeString(json.header.lastUser, 256)
    binary.writeInt32(json.header.time)
    binary.writeVector3(json.header.posEdit)
    binary.writeRotation(json.header.angleEdit)
    binary.writeInt32(typeof json.scene !== 'undefined' ? 1 : 0)
    binary.writeInt32(json.interactiveObjects.length)
    binary.writeInt32(json.header.numberOfNodes)

    binary.writeInt32(json.header.numberOfNodeLinks)
    binary.writeInt32(json.header.numberOfZones)
    binary.writeInt32(0) // lighting

    binary.writeInt32Array(repeat(0, 256))

    binary.writeInt32(json.lights.length)
    binary.writeInt32(json.fogs.length)
    binary.writeInt32(json.header.numberOfBackgroundPolygons)
    binary.writeInt32(json.header.numberOfIgnoredPolygons)
    binary.writeInt32(json.header.numberOfChildPolygons)
    binary.writeInt32(json.paths.length)

    binary.writeInt32Array(repeat(0, 250))

    binary.writeVector3(json.header.offset)

    binary.writeFloat32Array(repeat(0, 253))
    binary.writeString('', 4096)
    binary.writeInt32Array(repeat(0, 256))

    return buffer
  }

  static sizeOf() {
    return 8520
  }
}