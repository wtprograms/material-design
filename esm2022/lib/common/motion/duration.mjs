export const DURATION = {
    short1: 50,
    short2: 100,
    short3: 150,
    short4: 200,
    medium1: 250,
    medium2: 300,
    medium3: 350,
    medium4: 400,
    long1: 450,
    long2: 500,
    long3: 550,
    long4: 600,
    extraLong1: 700,
    extraLong2: 800,
    extraLong3: 900,
    extraLong4: 1000,
};
export function durationToMilliseconds(duration) {
    if (!duration) {
        return undefined;
    }
    if (typeof duration === 'number') {
        return duration;
    }
    return DURATION[duration];
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHVyYXRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy93dHByb2dyYW1zL21hdGVyaWFsLWRlc2lnbi9zcmMvbGliL2NvbW1vbi9tb3Rpb24vZHVyYXRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsTUFBTSxDQUFDLE1BQU0sUUFBUSxHQUFHO0lBQ3RCLE1BQU0sRUFBRSxFQUFFO0lBQ1YsTUFBTSxFQUFFLEdBQUc7SUFDWCxNQUFNLEVBQUUsR0FBRztJQUNYLE1BQU0sRUFBRSxHQUFHO0lBQ1gsT0FBTyxFQUFFLEdBQUc7SUFDWixPQUFPLEVBQUUsR0FBRztJQUNaLE9BQU8sRUFBRSxHQUFHO0lBQ1osT0FBTyxFQUFFLEdBQUc7SUFDWixLQUFLLEVBQUUsR0FBRztJQUNWLEtBQUssRUFBRSxHQUFHO0lBQ1YsS0FBSyxFQUFFLEdBQUc7SUFDVixLQUFLLEVBQUUsR0FBRztJQUNWLFVBQVUsRUFBRSxHQUFHO0lBQ2YsVUFBVSxFQUFFLEdBQUc7SUFDZixVQUFVLEVBQUUsR0FBRztJQUNmLFVBQVUsRUFBRSxJQUFJO0NBQ2pCLENBQUM7QUFJRixNQUFNLFVBQVUsc0JBQXNCLENBQUMsUUFBNEI7SUFDakUsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ2QsT0FBTyxTQUFTLENBQUM7SUFDbkIsQ0FBQztJQUNELElBQUksT0FBTyxRQUFRLEtBQUssUUFBUSxFQUFFLENBQUM7UUFDakMsT0FBTyxRQUFRLENBQUM7SUFDbEIsQ0FBQztJQUNELE9BQU8sUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQzVCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgY29uc3QgRFVSQVRJT04gPSB7XG4gIHNob3J0MTogNTAsXG4gIHNob3J0MjogMTAwLFxuICBzaG9ydDM6IDE1MCxcbiAgc2hvcnQ0OiAyMDAsXG4gIG1lZGl1bTE6IDI1MCxcbiAgbWVkaXVtMjogMzAwLFxuICBtZWRpdW0zOiAzNTAsXG4gIG1lZGl1bTQ6IDQwMCxcbiAgbG9uZzE6IDQ1MCxcbiAgbG9uZzI6IDUwMCxcbiAgbG9uZzM6IDU1MCxcbiAgbG9uZzQ6IDYwMCxcbiAgZXh0cmFMb25nMTogNzAwLFxuICBleHRyYUxvbmcyOiA4MDAsXG4gIGV4dHJhTG9uZzM6IDkwMCxcbiAgZXh0cmFMb25nNDogMTAwMCxcbn07XG5cbmV4cG9ydCB0eXBlIER1cmF0aW9uID0ga2V5b2YgdHlwZW9mIERVUkFUSU9OO1xuXG5leHBvcnQgZnVuY3Rpb24gZHVyYXRpb25Ub01pbGxpc2Vjb25kcyhkdXJhdGlvbj86IER1cmF0aW9uIHwgbnVtYmVyKTogbnVtYmVyIHwgdW5kZWZpbmVkIHtcbiAgaWYgKCFkdXJhdGlvbikge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cbiAgaWYgKHR5cGVvZiBkdXJhdGlvbiA9PT0gJ251bWJlcicpIHtcbiAgICByZXR1cm4gZHVyYXRpb247XG4gIH1cbiAgcmV0dXJuIERVUkFUSU9OW2R1cmF0aW9uXTtcbn0iXX0=