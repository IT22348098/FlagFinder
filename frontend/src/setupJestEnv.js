// This file sets up the Jest environment before tests
import "whatwg-fetch";
// At the top of your test file or setup file
import { TransformStream } from "node:stream/web";
global.TransformStream = TransformStream;
import fetchMock from "jest-fetch-mock";
fetchMock.enableMocks();

// Add BroadcastChannel polyfill since your initial error showed it was missing
global.BroadcastChannel = class BroadcastChannel {
  constructor(channel) {
    this.channel = channel;
    this.listeners = {};
  }

  postMessage(message) {
    // Mock implementation
  }

  addEventListener(type, listener) {
    if (!this.listeners[type]) {
      this.listeners[type] = [];
    }
    this.listeners[type].push(listener);
  }

  removeEventListener(type, listener) {
    if (!this.listeners[type]) return;
    this.listeners[type] = this.listeners[type].filter((l) => l !== listener);
  }

  close() {
    this.listeners = {};
  }
};

// Polyfill for TextEncoder and TextDecoder used by MSW and other packages
const { TextEncoder, TextDecoder } = require("util");
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Add other browser globals that may be needed
global.fetch = require("node-fetch");
