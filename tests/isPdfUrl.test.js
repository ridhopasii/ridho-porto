const { isPdfUrl } = require('../src/utils/viewUtils');

describe('isPdfUrl', () => {
  test('detects pdf with query string', () => {
    expect(isPdfUrl('https://example.com/doc.pdf?token=abc')).toBe(true);
  });

  test('returns false for images', () => {
    expect(isPdfUrl('/uploads/abc.png')).toBe(false);
  });

  test('handles null/undefined', () => {
    expect(isPdfUrl()).toBe(false);
  });
});
