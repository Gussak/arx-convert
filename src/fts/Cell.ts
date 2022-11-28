import { Buffer } from 'node:buffer'
import { BinaryIO } from '../binary/BinaryIO'
import { times } from '../common/helpers'
import { ArxPolygon, Polygon } from './Polygon'
import { SceneInfo } from './SceneInfo'

export type ArxCell = {
  polygons: ArxPolygon[]
  anchors: number[]
}

export class Cell {
  static readFrom(binary: BinaryIO): ArxCell {
    const { numberOfPolygons, numberOfAnchors } = SceneInfo.readFrom(binary)

    return {
      polygons: times(() => Polygon.readFrom(binary), numberOfPolygons),
      anchors: binary.readInt32Array(numberOfAnchors),
    }
  }

  static accumulateFrom(cell: ArxCell) {
    const buffer = Buffer.alloc(cell.anchors.length * 4)
    const binary = new BinaryIO(buffer.buffer)

    binary.writeBuffer(SceneInfo.accumulateFrom(cell))
    binary.writeBuffer(Buffer.concat(cell.polygons.map(Polygon.accumulateFrom)))
    binary.writeInt32Array(cell.anchors)

    return buffer
  }
}
