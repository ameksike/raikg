
const lib = require('../');

describe('LOAD', () => {
    it("should a valid lib", () => {
        expect(lib).toBeInstanceOf(Object);
        expect(lib.cls.Server).toBeInstanceOf(Function);
    });
});