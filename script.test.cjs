const { test } = require("node:test");
const assert = require("node:assert/strict");
const vm = require("node:vm");
const fs = require("node:fs");
const source = fs.readFileSync(require("node:path").join(__dirname, "script.js"), "utf8");
function setup({blocked = false, full = false, initial = {}} = {}) {
  let now = new Date(2026, 9, 30, 12).getTime();
  const data = new Map(Object.entries(initial));
  const events = {};
  const elements = {};
  for (const id of ["messageButton", "messageBox", "dailyMessage", "storageNotice"]) {
    const classes = new Set(id === "messageBox" || id === "storageNotice" ? ["hidden"] : []);
    elements[id] = {textContent: "", attributes: {},
      classList: {add: key => classes.add(key), remove: key => classes.delete(key),
        contains: key => classes.has(key), toggle: (key, on) => on ? classes.add(key) : classes.delete(key)},
      setAttribute(key, value) {this.attributes[key] = value;},
      addEventListener(key, callback) {this[key] = callback;}
    };
  }
  class Clock extends Date {constructor(...args) {super(...(args.length ? args : [now]));}}
  const context = vm.createContext({Date: Clock, Math,
    document: {hidden: false, getElementById: id => elements[id], addEventListener: (key, fn) => events[key] = fn},
    window: {addEventListener: (key, fn) => events[key] = fn},
    localStorage: {getItem(key) {if (blocked) throw Error("blocked"); return data.get(key) ?? null;},
      setItem(key, value) {if (blocked || full) throw Error("full"); data.set(key, value);}},
    setTimeout: fn => {events.midnight = fn; return 1;}, clearTimeout() {}
  });
  vm.runInContext(source, context);
  return {elements, data, events, advance() {now += 86400000;}};
}
test("repeated opens and reloads keep today's message", () => {
  const app = setup();
  app.elements.messageButton.click();
  const message = app.elements.dailyMessage.textContent;
  assert.ok(message);
  app.elements.messageButton.click();
  assert.equal(app.elements.dailyMessage.textContent, message);
  const reload = setup({initial: Object.fromEntries(app.data)});
  assert.match(reload.elements.messageButton.textContent, /again/);
  reload.elements.messageButton.click();
  assert.equal(reload.elements.dailyMessage.textContent, message);
  assert.equal(reload.elements.messageButton.attributes["aria-expanded"], "true");
});
test("midnight clears stale content and avoids repeating the previous message", () => {
  const app = setup();
  app.elements.messageButton.click();
  const previous = app.elements.dailyMessage.textContent;
  app.advance();
  app.events.midnight();
  assert.equal(app.elements.dailyMessage.textContent, "");
  assert.equal(app.elements.messageBox.classList.contains("hidden"), true);
  assert.equal(app.elements.messageButton.attributes["aria-expanded"], "false");
  app.elements.messageButton.click();
  assert.notEqual(app.elements.dailyMessage.textContent, previous);
});
for (const mode of ["blocked", "full"]) test(mode + " storage falls back to stable in-memory messages", () => {
  const app = setup({[mode]: true});
  app.elements.messageButton.click();
  const message = app.elements.dailyMessage.textContent;
  app.elements.messageButton.click();
  assert.ok(message);
  assert.equal(app.elements.dailyMessage.textContent, message);
  assert.equal(app.elements.storageNotice.classList.contains("hidden"), false);
});
test("returning to an old tab resets the day before reveal", () => {
  const app = setup();
  app.elements.messageButton.click();
  const previous = app.elements.dailyMessage.textContent;
  app.advance();
  app.events.visibilitychange();
  assert.equal(app.elements.dailyMessage.textContent, "");
  app.elements.messageButton.click();
  assert.notEqual(app.elements.dailyMessage.textContent, previous);
});
test("invalid stored messages are replaced", () => {
  const app = setup({initial: {messageDate: "2026-10-30", dailyMessage: "invalid"}});
  app.elements.messageButton.click();
  assert.notEqual(app.elements.dailyMessage.textContent, "invalid");
});
test("changes in another tab reset the displayed message", () => {
  const app = setup();
  app.elements.messageButton.click();
  app.data.clear();
  app.events.storage({key: null});
  assert.equal(app.elements.messageBox.classList.contains("hidden"), true);
});
