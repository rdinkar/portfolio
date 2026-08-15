import { test } from 'node:test';
import assert from 'node:assert/strict';
import { easeOutCubic, countUpFrames } from '../src/lib/animate.js';

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
