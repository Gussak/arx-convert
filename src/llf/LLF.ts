import { Buffer } from 'node:buffer'
import { BinaryIO } from '@common/BinaryIO'
import { ArxColor, Color } from '@common/Color'
import { times } from '@common/helpers'
import { ArxLight, Light } from '@llf/Light'
import { LightingHeader } from '@llf/LightingHeader'
import { ArxLlfHeader, LlfHeader } from '@llf/LlfHeader'

export type ArxLLF = {
  header: Omit<ArxLlfHeader, 'numberOfLights'>
  lights: ArxLight[]
  colors: ArxColor[]
}

export class LLF {
  static load(decompressedFile: Buffer): ArxLLF {
    const file = new BinaryIO(decompressedFile)

    const { numberOfLights, ...header } = LlfHeader.readFrom(file)
    const lights = times(() => Light.readFrom(file), numberOfLights)

    const { numberOfColors } = LightingHeader.readFrom(file)
    const colors = times(() => Color.readFrom(file, 'bgra'), numberOfColors)

    return {
      header,
      lights,
      colors,
    }
  }

  static save(json: ArxLLF) {
    const header = LlfHeader.accumulateFrom(json)

    const lights = Buffer.concat(json.lights.map(Light.accumulateFrom))

    const lightingHeader = LightingHeader.accumulateFrom(json.colors)

    const colors = Buffer.concat(json.colors.map((color) => Color.accumulateFrom(color, 'bgra')))

    return Buffer.concat([header, lights, lightingHeader, colors])
  }
}
