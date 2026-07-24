/** Express 5 types `req.params` values as `string | string[]`. */
export function paramId(value: string | string[] | undefined): number {
  const raw = Array.isArray(value) ? value[0] : value;
  return parseInt(raw ?? "", 10);
}
