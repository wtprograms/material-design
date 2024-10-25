export const EASING = {
    emphasized: 'cubic-bezier(0.2, 0, 0, 1)',
    emphasizedAccelerate: 'cubic-bezier(0.3, 0, 0.8, 0.15)',
    emphasizedDecelerate: 'cubic-bezier(0.05, 0.7, 0.1, 1)',
    standard: 'cubic-bezier(0.2, 0, 0, 1)',
    standardAccelerate: 'cubic-bezier(0.3, 0, 1, 1)',
    standardDecelerate: 'cubic-bezier(0, 0, 0, 1)',
    legacy: 'cubic-bezier(0.4, 0, 0.2, 1)',
    legacyAccelerate: 'cubic-bezier(0.4, 0, 1, 1)',
    legacyDecelerate: 'cubic-bezier(0, 0, 0.2, 1)',
    linear: 'cubic-bezier(0, 0, 1, 1)',
};
export function easingToFunction(easing) {
    if (!easing) {
        return undefined;
    }
    if (easing in EASING) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return EASING[easing];
    }
    return easing;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWFzaW5nLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvd3Rwcm9ncmFtcy9tYXRlcmlhbC1kZXNpZ24vc3JjL2xpYi9jb21tb24vbW90aW9uL2Vhc2luZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxNQUFNLENBQUMsTUFBTSxNQUFNLEdBQUc7SUFDcEIsVUFBVSxFQUFFLDRCQUE0QjtJQUN4QyxvQkFBb0IsRUFBRSxpQ0FBaUM7SUFDdkQsb0JBQW9CLEVBQUUsaUNBQWlDO0lBQ3ZELFFBQVEsRUFBRSw0QkFBNEI7SUFDdEMsa0JBQWtCLEVBQUUsNEJBQTRCO0lBQ2hELGtCQUFrQixFQUFFLDBCQUEwQjtJQUM5QyxNQUFNLEVBQUUsOEJBQThCO0lBQ3RDLGdCQUFnQixFQUFFLDRCQUE0QjtJQUM5QyxnQkFBZ0IsRUFBRSw0QkFBNEI7SUFDOUMsTUFBTSxFQUFFLDBCQUEwQjtDQUNuQyxDQUFDO0FBSUYsTUFBTSxVQUFVLGdCQUFnQixDQUFDLE1BQXdCO0lBQ3ZELElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUNaLE9BQU8sU0FBUyxDQUFDO0lBQ25CLENBQUM7SUFDRCxJQUFJLE1BQU0sSUFBSSxNQUFNLEVBQUUsQ0FBQztRQUNyQiw4REFBOEQ7UUFDOUQsT0FBUSxNQUFjLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDakMsQ0FBQztJQUNELE9BQU8sTUFBTSxDQUFDO0FBQ2hCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgY29uc3QgRUFTSU5HID0ge1xuICBlbXBoYXNpemVkOiAnY3ViaWMtYmV6aWVyKDAuMiwgMCwgMCwgMSknLFxuICBlbXBoYXNpemVkQWNjZWxlcmF0ZTogJ2N1YmljLWJlemllcigwLjMsIDAsIDAuOCwgMC4xNSknLFxuICBlbXBoYXNpemVkRGVjZWxlcmF0ZTogJ2N1YmljLWJlemllcigwLjA1LCAwLjcsIDAuMSwgMSknLFxuICBzdGFuZGFyZDogJ2N1YmljLWJlemllcigwLjIsIDAsIDAsIDEpJyxcbiAgc3RhbmRhcmRBY2NlbGVyYXRlOiAnY3ViaWMtYmV6aWVyKDAuMywgMCwgMSwgMSknLFxuICBzdGFuZGFyZERlY2VsZXJhdGU6ICdjdWJpYy1iZXppZXIoMCwgMCwgMCwgMSknLFxuICBsZWdhY3k6ICdjdWJpYy1iZXppZXIoMC40LCAwLCAwLjIsIDEpJyxcbiAgbGVnYWN5QWNjZWxlcmF0ZTogJ2N1YmljLWJlemllcigwLjQsIDAsIDEsIDEpJyxcbiAgbGVnYWN5RGVjZWxlcmF0ZTogJ2N1YmljLWJlemllcigwLCAwLCAwLjIsIDEpJyxcbiAgbGluZWFyOiAnY3ViaWMtYmV6aWVyKDAsIDAsIDEsIDEpJyxcbn07XG5cbmV4cG9ydCB0eXBlIEVhc2luZyA9IGtleW9mIHR5cGVvZiBFQVNJTkc7XG5cbmV4cG9ydCBmdW5jdGlvbiBlYXNpbmdUb0Z1bmN0aW9uKGVhc2luZz86IEVhc2luZyB8IHN0cmluZyk6IHN0cmluZyB8IHVuZGVmaW5lZCB7XG4gIGlmICghZWFzaW5nKSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuICBpZiAoZWFzaW5nIGluIEVBU0lORykge1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZXhwbGljaXQtYW55XG4gICAgcmV0dXJuIChFQVNJTkcgYXMgYW55KVtlYXNpbmddO1xuICB9XG4gIHJldHVybiBlYXNpbmc7XG59Il19