/** Returns a promise that resolves after `ms` milliseconds (used to fake network latency). */
export function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
