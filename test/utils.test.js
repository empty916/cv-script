const { isObj } = require('../dist/utils');

test('is object false', () => {
    expect(isObj(11)).toBe(false);
    expect(isObj('11')).toBe(false);
    expect(isObj(null)).toBe(false);
    expect(isObj(false)).toBe(false);
});


test('is object true', () => {
    expect(isObj({})).toBe(true);
    expect(isObj({a: 1})).toBe(true);
    expect(isObj(Object.create(null))).toBe(true);
});


