import { sleep } from './sleep';

export async function delay(ms: number, predicate: () => boolean, callback: () => Promise<void> | void) {
  await sleep(ms);
  if (predicate()) {
    await Promise.resolve(callback());
  }
}