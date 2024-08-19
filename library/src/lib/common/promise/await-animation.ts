export function awaitAnimation(animation: Animation | undefined): Promise<void> {
  if (!animation) {
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    animation.onfinish = () => resolve();
    animation.oncancel = () => resolve();
  });
}