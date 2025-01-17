import { Buffer } from 'node:buffer'
import { BinaryIO } from '@common/BinaryIO'
import { times } from '@common/helpers'
import { ArxEPData, EPData } from '@fts/EPData'
import { RoomData } from '@fts/RoomData'

export type ArxRoom = {
  portals: number[]
  polygons: ArxEPData[]
}

export class Room {
  static readFrom(binary: BinaryIO): ArxRoom {
    const { numberOfPortals, numberOfPolygons } = RoomData.readFrom(binary)

    return {
      portals: times(() => binary.readInt32(), numberOfPortals),
      polygons: times(() => EPData.readFrom(binary), numberOfPolygons),
    }
  }

  static accumulateFrom(room: ArxRoom) {
    const roomData = RoomData.accumulateFrom(room)

    const portals = Buffer.alloc(room.portals.length * 4)
    const binary = new BinaryIO(portals)

    binary.writeInt32Array(room.portals)

    const polygons = Buffer.concat(room.polygons.map(EPData.accumulateFrom))

    return Buffer.concat([roomData, portals, polygons])
  }
}
