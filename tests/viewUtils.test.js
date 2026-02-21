const { parseTags, projectType, groupProjectsByType, sortAwardsByDate } = require('../src/utils/viewUtils');

describe('viewUtils', () => {
  test('parseTags splits and normalizes', () => {
    expect(parseTags('Design, JS , UI')).toEqual(['design', 'js', 'ui']);
  });

  test('projectType detects design', () => {
    expect(projectType({ tags: 'ui, web' })).toBe('design');
  });

  test('projectType detects editing', () => {
    expect(projectType({ tags: 'video, edit' })).toBe('editing');
  });

  test('groupProjectsByType groups properly', () => {
    const grouped = groupProjectsByType([{ tags: 'ui' }, { tags: 'video' }, { tags: 'web' }]);
    expect(grouped.design.length).toBe(1);
    expect(grouped.editing.length).toBe(1);
    expect(grouped.project.length).toBe(1);
  });

  test('sortAwardsByDate sorts desc', () => {
    const arr = [{ date: '2024-01' }, { date: '2025-05' }, { date: '2023-12' }];
    const sorted = sortAwardsByDate(arr);
    expect(sorted[0].date).toBe('2025-05');
    expect(sorted[2].date).toBe('2023-12');
  });
});
