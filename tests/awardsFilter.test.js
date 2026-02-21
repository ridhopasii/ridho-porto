const { filterAwardsByCategory } = require('../src/utils/viewUtils');

describe('filterAwardsByCategory', () => {
  const awards = [
    { title: 'A', category: 'teknologi' },
    { title: 'B', category: 'bahasa' },
    { title: 'C', category: 'soft-skill' },
    { title: 'D' },
  ];

  test('returns all when category is all or empty', () => {
    expect(filterAwardsByCategory(awards, 'all').length).toBe(4);
    expect(filterAwardsByCategory(awards, '').length).toBe(4);
  });

  test('filters by exact category (case-insensitive)', () => {
    const res = filterAwardsByCategory(awards, 'Teknologi');
    expect(res.length).toBe(1);
    expect(res[0].title).toBe('A');
  });

  test('returns empty when no match', () => {
    const res = filterAwardsByCategory(awards, 'non-existent');
    expect(res.length).toBe(0);
  });
});
