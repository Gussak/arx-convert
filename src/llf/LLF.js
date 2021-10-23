const { times, map } = require("ramda");
const BinaryIO = require("../binary/BinaryIO.js");
const Header = require("./Header.js");
const Light = require("../common/Light.js");
const LightingHeader = require("../common/LightingHeader.js");
const Color = require("../common/Color.js");

class LLF {
  static load(decompressedFile) {
    const file = new BinaryIO(decompressedFile.buffer);

    const { numberOfLights, ...header } = Header.readFrom(file);

    const data = {
      meta: {
        type: "llf",
        numberOfLeftoverBytes: 0,
      },
      header: header,
    };

    data.lights = times(() => Light.readFrom(file), numberOfLights);

    const { numberOfColors } = LightingHeader.readFrom(file);

    data.colors = times(
      () => Color.readFrom(file, header.version > 1.001),
      numberOfColors
    );

    const remainedBytes = decompressedFile.length - file.position;
    if (remainedBytes > 0) {
      data.meta.numberOfLeftoverBytes = remainedBytes;
    }

    return data;
  }

  static save(json) {
    const header = Header.accumulateFrom(json);

    const lights = Buffer.concat(
      map(Light.accumulateFrom.bind(Light), json.lights)
    );

    const lightingHeader = LightingHeader.accumulateFrom(json);

    const colors = Buffer.concat(
      map(
        (color) => Color.accumulateFrom(color, json.header.version > 1.001),
        json.colors
      )
    );

    const lighting = Buffer.concat([lightingHeader, colors]);

    return Buffer.concat([header, lights, lighting]);
  }
}

module.exports = LLF;