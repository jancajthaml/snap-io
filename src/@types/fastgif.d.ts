
declare module "fastgif/fastgif" {
  export class Decoder {
    decode(buffer: ArrayBuffer): Promise<{
      imageData: any;
      delay: number;
    }[]> {}
  }
}
