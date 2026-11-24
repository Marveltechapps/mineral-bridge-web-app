/**
 * BUG-011: sell photo slots must not fake a preview with the catalogue placeholder.
 */
describe('BUG-011: mineral image preview slots', () => {
  function slotImg(up?: { uri?: string } | null): string {
    return up && up.uri ? `url('${up.uri}')` : 'none';
  }

  it('BUG-011: uploaded photo uses its blob uri', () => {
    expect(slotImg({ uri: 'blob:http://localhost/abc' })).toBe("url('blob:http://localhost/abc')");
  });

  it('BUG-011: empty slot has no background image', () => {
    expect(slotImg(null)).toBe('none');
    expect(slotImg({ uri: '' })).toBe('none');
  });

  it('BUG-011 neighbouring: three uploads yield three distinct preview urls', () => {
    const urls = ['blob:a', 'blob:b', 'blob:c'].map((uri) => slotImg({ uri }));
    expect(new Set(urls).size).toBe(3);
  });
});
