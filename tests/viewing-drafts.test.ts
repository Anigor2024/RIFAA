import test from 'node:test';
import assert from 'node:assert/strict';
import { isFutureViewingSlot, saudiToday, validCalendarDate } from '../lib/viewing-drafts';

test('Saudi date turns over at 21:00 UTC rather than the server date', () => {
  assert.equal(saudiToday(new Date('2026-10-12T20:59:59Z')), '2026-10-12');
  assert.equal(saudiToday(new Date('2026-10-12T21:00:00Z')), '2026-10-13');
});
test('calendar validation rejects impossible dates and includes real leap days', () => {
  for (const invalid of ['2026-02-30', '2026-02-29', '2026-13-01', '2026-4-1', '', 'tomorrow']) assert.equal(validCalendarDate(invalid), false, invalid);
  assert.equal(validCalendarDate('2028-02-29'), true);
});
test('viewing slots must be strictly in the future in Saudi time and one of the offered times', () => {
  const now = new Date('2026-10-12T13:00:00Z'); // 16:00 in Riyadh.
  assert.equal(isFutureViewingSlot('2026-10-12', '4:00 م', now), false);
  assert.equal(isFutureViewingSlot('2026-10-12', '1:00 م', now), false);
  assert.equal(isFutureViewingSlot('2026-10-12', '7:00 م', now), true);
  assert.equal(isFutureViewingSlot('2026-10-13', '10:00 ص', now), true);
  assert.equal(isFutureViewingSlot('2026-10-13', 'not-a-time', now), false);
  assert.equal(isFutureViewingSlot('2027-02-30', '4:00 م', now), false);
});
