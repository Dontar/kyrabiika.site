
export function classes(obj: Record<string, boolean>): string {
  return Object.entries(obj).reduce((a, [cls, val]) => {
    if (val) {
      a.push(cls);
    }
    return a;
  }, [] as string[]).join(" ");
}
