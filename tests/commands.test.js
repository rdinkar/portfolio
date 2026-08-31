import { test } from 'node:test';
import assert from 'node:assert/strict';
import { filterCommands } from '../src/lib/commands.js';

const cmds = [
  { label: 'Go to Work' }, { label: 'Copy email', keywords: 'contact mail' }, { label: 'Open GitHub' },
];

test('empty query returns all', () => {
  assert.equal(filterCommands(cmds, '').length, 3);
});
test('matches label case-insensitively', () => {
  assert.deepEqual(filterCommands(cmds, 'work').map(c => c.label), ['Go to Work']);
});
test('matches keywords and requires all tokens', () => {
  assert.deepEqual(filterCommands(cmds, 'mail').map(c => c.label), ['Copy email']);
  assert.equal(filterCommands(cmds, 'open git').length, 1);
  assert.equal(filterCommands(cmds, 'open work').length, 0);
});
