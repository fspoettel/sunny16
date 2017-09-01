import { clip, compareFloats } from '../helpers';

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
  it('respects epsilon when comparing numbers', () => {
    const epsilon = 0.001;

    const a = 0.0001;
    const b = 0.0002;

    expect(compareFloats(a, b, epsilon)).toBeTruthy();

    const c = 0.001;
    const d = 0.0022;

    expect(compareFloats(c, d, epsilon)).toBeFalsy();
  });
});
