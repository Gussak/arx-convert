export declare class DLF {
  static load(rawIn: Buffer): Record<string, any>
  static save(data: Record<string, any>): Buffer
}