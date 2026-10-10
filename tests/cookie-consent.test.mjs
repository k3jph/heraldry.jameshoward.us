import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

const script = readFileSync(new URL('../public/assets/js/gdpr-cookie.js', import.meta.url), 'utf8');
const gaId = 'G-FSDET4HG4L';

// Execute the production script against a browser adapter: cookies, DOM events,
// asynchronous frame/timer queues, focus, and external script insertions.
function browser({cookies = {}, gpc = false, hostname = 'heraldryproject.org', blocked = false, readyState = 'complete'} = {}) {
  const jar = new Map(Object.entries(cookies)), writes = [], scripts = [], frames = [], timers = [], events = [];
  const listeners = new Map();
  let doc;
  const element = () => {
    const attributes = new Map(), classes = new Set(), handlers = new Map();
    return {
      hidden: true, src: '', async: false,
      setAttribute: (name, value) => attributes.set(name, value),
      getAttribute: name => attributes.get(name),
      classList: {add: name => classes.add(name), remove: name => classes.delete(name), contains: name => classes.has(name)},
      addEventListener: (name, handler) => handlers.set(name, handler),
      click() { handlers.get('click')?.({target: this}); },
      focus() { doc.activeElement = this; },
      closest(selector) { return selector === '[data-cookie-preferences]' && this.isPreferences ? this : null; },
    };
  };
  const accept = element(), reject = element(), preferences = element(), policyPreferences = element(), banner = element(), gpcMessage = element();
  preferences.isPreferences = policyPreferences.isPreferences = true;
  banner.setAttribute('aria-hidden', 'true');
  banner.querySelector = selector => ({'[data-cookie-accept]': accept, '[data-cookie-reject]': reject, '[data-cookie-gpc]': gpcMessage})[selector];
  banner.contains = node => [accept, reject, banner].includes(node);
  doc = {
    readyState, activeElement: null,
    querySelector: selector => selector === '#gdpr-cookie' ? banner
      : selector === '[data-cookie-preferences]' ? preferences
      : scripts.find(s => selector === 'script[data-gdpr-cookie-ga="' + gaId + '"]' && s.getAttribute('data-gdpr-cookie-ga') === gaId),
    createElement: element,
    head: {appendChild: script => scripts.push(script)},
    addEventListener: (name, handler) => listeners.set(name, handler),
    get cookie() { if (blocked) throw new Error('Storage blocked'); return [...jar].map(([key, value]) => key + '=' + value).join('; '); },
    set cookie(value) {
      if (blocked) throw new Error('Storage blocked');
      writes.push(value);
      const [pair] = value.split(';'), separator = pair.indexOf('=');
      const name = pair.slice(0, separator), content = pair.slice(separator + 1);
      if (/Expires=Thu, 01 Jan 1970/.test(value)) jar.delete(name);
      else jar.set(name, content);
    },
  };
  const win = {
    location: {hostname, protocol: 'https:'}, navigator: {globalPrivacyControl: gpc},
    requestAnimationFrame: callback => frames.push(callback),
    setTimeout: callback => timers.push(callback),
    dispatchEvent: event => events.push(event),
  };
  class CustomEvent { constructor(type, options) { this.type = type; this.detail = options.detail; } }
  vm.runInNewContext(script, {window: win, document: doc, CustomEvent, Date, Object, Number, encodeURIComponent, decodeURIComponent});
  win.cookieStart(gaId, 'cookieConsent', 365, '1');
  const flush = () => { while (frames.length) frames.shift()(); while (timers.length) timers.shift()(); };
  const open = (control = preferences) => {
    control.focus();
    listeners.get('click')({target: control, preventDefault() {}});
    flush();
  };
  return {win, doc, accept, reject, preferences, policyPreferences, banner, gpcMessage, jar, writes, scripts, events, flush, open,
    ready: () => listeners.get('DOMContentLoaded')?.(),
    commands: () => (win.dataLayer ?? []).map(args => Array.from(args))};
}

test('a new visit shows choices without loading Google, queuing pings, or writing a cookie', () => {
  const b = browser(); b.flush();
  assert.equal(b.banner.hidden, false);
  assert.equal(b.banner.getAttribute('aria-hidden'), 'false');
  assert.equal(b.doc.activeElement, null);
  assert.equal(b.win['ga-disable-' + gaId], true);
  assert.deepEqual(b.scripts, []);
  assert.deepEqual(b.commands(), []);
  assert.deepEqual(b.writes, []);
});

test('acceptance alone loads one production tag with all advertising features denied', () => {
  const b = browser(); b.flush(); b.accept.click(); b.flush();
  assert.equal(b.scripts.length, 1);
  assert.equal(b.scripts[0].src, 'https://www.googletagmanager.com/gtag/js?id=' + gaId);
  assert.equal(b.scripts[0].async, true);
  assert.equal(b.win['ga-disable-' + gaId], false);
  assert.equal(b.jar.get('cookieConsent'), 'accepted%3A1');
  assert.match(b.writes[0], /Expires=.*; Path=\/; SameSite=Lax; Secure$/);
  assert.doesNotMatch(b.writes[0], /Domain=/);
  const [consent, startup, config] = b.commands();
  assert.deepEqual(consent.slice(0, 2), ['consent', 'default']);
  assert.equal(consent[2].analytics_storage, 'granted');
  for (const field of ['ad_storage', 'ad_user_data', 'ad_personalization']) assert.equal(consent[2][field], 'denied');
  assert.equal(startup[0], 'js');
  assert.equal(config[0], 'config');
  assert.equal(config[1], gaId);
  assert.equal(config[2].allow_google_signals, false);
  assert.equal(config[2].allow_ad_personalization_signals, false);
  b.accept.click();
  assert.equal(b.scripts.length, 1);
  assert.equal(b.commands().length, 3);
});

test('rejecting saves a host-only choice and never contacts Google', () => {
  const b = browser(); b.flush(); b.reject.click(); b.flush();
  assert.equal(b.jar.get('cookieConsent'), 'rejected%3A1');
  assert.equal(b.banner.hidden, true);
  assert.deepEqual(b.scripts, []);
  assert.deepEqual(b.commands(), []);
});

test('current accepted consent is honored on the next page', () => {
  const b = browser({cookies: {cookieConsent: 'accepted%3A1'}}); b.flush();
  assert.equal(b.banner.hidden, true);
  assert.equal(b.scripts.length, 1);
});

test('current rejected consent is honored on the next page', () => {
  const b = browser({cookies: {cookieConsent: 'rejected%3A1'}}); b.flush();
  assert.equal(b.banner.hidden, true);
  assert.deepEqual(b.scripts, []);
  assert.deepEqual(b.commands(), []);
});

test('expired policy versions, legacy values, and malformed cookies require a new choice', () => {
  for (const value of ['accepted%3A0', 'accepted', 'true', '%not-valid', 'unknown%3A1']) {
    const b = browser({cookies: {cookieConsent: value}}); b.flush();
    assert.equal(b.banner.hidden, false, value);
    assert.equal(b.scripts.length, 0, value);
  }
});

test('Global Privacy Control overrides stored acceptance and new acceptance attempts', () => {
  const b = browser({gpc: true, cookies: {cookieConsent: 'accepted%3A1', _ga: 'old'}}); b.flush();
  assert.equal(b.jar.get('cookieConsent'), 'rejected%3A1');
  assert.equal(b.jar.has('_ga'), false);
  assert.equal(b.scripts.length, 0);
  b.open();
  assert.equal(b.gpcMessage.hidden, false);
  b.accept.click(); b.flush();
  assert.equal(b.jar.get('cookieConsent'), 'rejected%3A1');
  assert.equal(b.scripts.length, 0);
});

test('withdrawal disables measurement immediately, clears GA cookies, and preserves local work cookies', () => {
  const b = browser({cookies: {_ga: 'browser', _ga_FSDET4HG4L: 'session', unrelated: 'keep'}}); b.flush();
  b.accept.click(); b.flush();
  b.open(); b.reject.click(); b.flush();
  assert.equal(b.win['ga-disable-' + gaId], true);
  assert.equal(b.jar.has('_ga'), false);
  assert.equal(b.jar.has('_ga_FSDET4HG4L'), false);
  assert.equal(b.jar.get('unrelated'), 'keep');
  assert.equal(b.jar.get('cookieConsent'), 'rejected%3A1');
  assert.equal(b.commands().length, 3, 'withdrawal does not queue a consent ping');
  assert.ok(b.writes.some(value => value.startsWith('_ga=;') && value.includes('Domain=.heraldryproject.org')));
});

test('accepting again after withdrawal restores measurement without duplicating the tag', () => {
  const b = browser(); b.flush(); b.accept.click(); b.flush();
  b.open(); b.reject.click(); b.flush();
  assert.equal(b.win['ga-disable-' + gaId], true);
  b.open(); b.accept.click(); b.flush();
  assert.equal(b.win['ga-disable-' + gaId], false);
  assert.equal(b.scripts.length, 1);
  assert.equal(b.jar.get('cookieConsent'), 'accepted%3A1');
});

test('settings controls move focus to a choice and restore it to the invoking control', () => {
  const b = browser(); b.flush();
  for (const control of [b.preferences, b.policyPreferences]) {
    b.open(control);
    assert.equal(b.doc.activeElement, b.reject);
    b.reject.click(); b.flush();
    assert.equal(b.doc.activeElement, control);
  }
  const first = browser(); first.flush(); first.reject.focus(); first.reject.click(); first.flush();
  assert.equal(first.doc.activeElement, first.preferences);
});

test('a choice before the first animation frame cannot reopen the dismissed banner', () => {
  const b = browser(); b.reject.click(); b.flush();
  assert.equal(b.banner.hidden, true);
  assert.equal(b.banner.classList.contains('is-visible'), false);
});

test('blocked cookie access does not break the banner or rejection', () => {
  const b = browser({blocked: true}); b.flush();
  assert.equal(b.banner.hidden, false);
  b.reject.click(); b.flush();
  assert.equal(b.banner.hidden, true);
  assert.equal(b.win['ga-disable-' + gaId], true);
  assert.equal(b.scripts.length, 0);
});

test('local development and preview hosts never load production Analytics', () => {
  for (const hostname of ['localhost', '127.0.0.1', 'preview.example.org']) {
    const b = browser({hostname}); b.flush(); b.accept.click(); b.flush();
    assert.equal(b.scripts.length, 0);
    assert.equal(b.commands().length, 0);
  }
});

test('initialization waits for the DOM and repeated startup does not duplicate listeners or tags', () => {
  const b = browser({readyState: 'loading', cookies: {cookieConsent: 'accepted%3A1'}});
  assert.equal(b.scripts.length, 0);
  b.ready(); b.flush();
  b.win.cookieStart(gaId, 'cookieConsent', 365, '1');
  assert.equal(b.scripts.length, 1);
  assert.throws(() => b.win.cookieStart(gaId, 'cookieConsent', 365, '2'), /different settings/);
});
