
export function replaceAll(str: string, src: string, dst: string) {
  return str.split(src).join(dst);
}