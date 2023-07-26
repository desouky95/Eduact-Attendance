export function jsonReplacer(key: any, val: any) {
  var seen: any[] = [];

  if (val != null && typeof val == 'object') {
    if (seen.indexOf(val) >= 0) {
      return;
    }
    seen.push(val);
  }
  return val;
}
