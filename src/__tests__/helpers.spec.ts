import { clip } from '../helpers';

declare let describe;
declare let it;
declare let expect;

describe('clip()', () => {
  const mockData = ['foo', 'bar', 'baz', 'foobar', 'foobaz'];


  it('returns starting the first item if min() is invalid', () => {
    const result = clip(mockData, () => false, val => val === 'baz');
    expect(result).toEqual(['foo', 'bar', 'baz']);
  });

  it('returns finishing the last item if max() is invalid', () => {
    const result = clip(mockData, val => val === 'baz', () => false);
    expect(result).toEqual(['baz', 'foobar', 'foobaz']);
  });

  it('returns a clipped array for valid configuration', () => {
    const result = clip(mockData, val => val === 'baz', val => val === 'foobaz');
    expect(result).toEqual(['baz', 'foobar', 'foobaz']);
  });
});

describe('compareFloats()', () => {
  it('respects epsilon when comparing numbers', () => {});
});
