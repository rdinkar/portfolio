import { test } from 'node:test';
import assert from 'node:assert/strict';
import { easeOutCubic, countUpFrames, countUpValue } from '../src/lib/animate.js';

test('easeOutCubic maps 0→0 and 1→1', () => {
  assert.equal(easeOutCubic(0), 0);
  assert.equal(easeOutCubic(1), 1);
});

test('countUpFrames ends exactly at target and is non-decreasing', () => {
  const f = countUpFrames(95, 30);
  assert.equal(f.length, 30);
  assert.equal(f.at(-1), 95);
  for (let i = 1; i < f.length; i++) assert.ok(f[i] >= f[i - 1]);
});

test('countUpValue starts at 0 elapsed', () => {
  assert.equal(countUpValue(95, 0, 1000), 0);
});

test('countUpValue ends exactly at target on completion', () => {
  assert.equal(countUpValue(95, 1000, 1000), 95);
});

test('countUpValue clamps to target past completion', () => {
  assert.equal(countUpValue(95, 5000, 1000), 95);
});

test('countUpValue works with a different target/duration', () => {
  assert.equal(countUpValue(3, 0, 1200), 0);
  assert.equal(countUpValue(3, 1200, 1200), 3);
});

test('countUpValue is monotonic non-decreasing across a sweep', () => {
  const target = 95;
  const durationMs = 1000;
  let prev = -Infinity;
  for (let elapsed = 0; elapsed <= durationMs; elapsed += 25) {
    const v = countUpValue(target, elapsed, durationMs);
    assert.ok(v >= prev);
    prev = v;
  }
});
