export const stringConverter = {
  fromAttribute(value: string | null): string {
    return value ?? '';
  },
  toAttribute(value: string): string | null {
    return value || null;
  },
};
