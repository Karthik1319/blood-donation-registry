import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import { clearAccessToken } from '@/services/tokenStorage';

// jsdom (the fake browser tests run in) doesn't implement <dialog> methods yet; real browsers do.
// This minimal stand-in only opens/closes the dialog so ConfirmDialog can be tested.
if (!HTMLDialogElement.prototype.showModal) {
  HTMLDialogElement.prototype.showModal = function showModal() {
    this.open = true;
  };
  HTMLDialogElement.prototype.close = function close() {
    this.open = false;
  };
}

afterEach(() => {
  cleanup();
  clearAccessToken();
});
