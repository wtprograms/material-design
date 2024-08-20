export const FocusState = {
  None: 'none',
  ListRoot: 'list-root',
  FirstItem: 'first-item',
  LastItem: 'last-item',
} as const;

export type FocusState = (typeof FocusState)[keyof typeof FocusState];