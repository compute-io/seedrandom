var assert = require("assert");
var seedrandom = require("../seedrandom");

describe("Nodejs API Test", function() {

var original = Math.random;

it("should be able to use seedrandom('hello.')");
var rng = seedrandom('hello.');
assert.equal(typeof(rng), 'function', "Should return a function.");
var r = rng();
assert.equal(r, 0.9282578795792454, "Should be 'hello.'#1");
assert(original === Math.random, "Should not change Math.random.");
assert(original !== rng, "PRNG should not be Math.random.");

// Global PRNG: set Math.random.
it("should be able to use seedrandom('hello.', { global: true })");
var result = seedrandom('hello.', { global: true });
assert.equal(result, 'hello.', "Should return short seed.");
assert(original != Math.random, "Should change Math.random.");
r = Math.random();
assert.equal(r, 0.9282578795792454, "Should be 'hello.'#1");

// Autoseeded non-global
Math.random = original;
it("should be able to use seedrandom()");
result = seedrandom();
assert.equal(typeof(result), 'function', "Should return function.");
assert(original === Math.random, "Should not change Math.random.");
r = result();
it("got " + r);
assert(r != autoseed1, "Should not repeat previous autoseed.");
assert(r != 0.9282578795792454, "Should not be 'hello.'#1");
assert(r != 0.7316977468919549, "Should not be 'hello.'#3");

// Mixing accumulated entropy.
it("should be able to use seedrandom('added entropy.', { entropy: true })");
rng = seedrandom('added entropy.', { entropy: true });
r = result();
it("got " + r);
assert(r != autoseed1, "Should not repeat previous autoseed.");
assert(r != 0.597067214994467, "Should not be 'added entropy.'#1");

// Legacy calling convention for mixing accumulated entropy.
it("should be able to use seedrandom('added entropy.', true)");
rng = seedrandom('added entropy.', true);
r = result();
it("got " + r);
assert(r != autoseed1, "Should not repeat previous autoseed.");
assert(r != 0.597067214994467, "Should not be 'added entropy.'#1");

// The pass option
it("should be able to use Math.seedrandom(null, { pass: ...");
var obj = Math.seedrandom(null, { pass: function(prng, seed) {
  return { random: prng, seed: seed };
}});
assert(original === Math.random, "Should not change Math.random.");
assert(original !== obj.random, "Should be different from Math.random.");
assert.equal(typeof(obj.random), 'function', "Should return a PRNG function.");
assert.equal(typeof(obj.seed), 'string', "Should return a seed.");
var as2 = obj.random();
assert(as2 != 0.9282578795792454, "Should not be 'hello.'#1");
rng = seedrandom(obj.seed);
var as3 = rng();
assert.equal(as2, as3, "Should be reproducible when using the seed.");

// Exercise pass again, with explicit seed and global
it("should be able to use Math.seedrandom('hello.', { pass: ...");
result = Math.seedrandom('hello.', {
  global: 'abc',
  pass: function(prng, seed, global) {
    assert.equal(typeof(prng), 'function', "Callback arg #1 assert");
    assert.equal(seed, 'hello.', "Callback arg #2 assert");
    assert.equal(global, 'abc', "Callback arg #3 passed through.");
    assert.equal(prng(), 0.9282578795792454, "Should be 'hello.'#1");
    return 'def';
}});
assert.equal(result, 'def', "Should return value from callback.");
assert(original === Math.random, "Should not change Math.random.");

// Legacy third argument callback argument:
it("should be able to use Math.seedrandom('hello.', { global: 50 }, callback)");
result = Math.seedrandom('hello.', { global: 50 },
  function(prng, seed, global) {
    assert.equal(typeof(prng), 'function', "Callback arg #1 assert");
    assert.equal(seed, 'hello.', "Callback arg #2 assert");
    assert.equal(global, 50, "Callback arg #3 assert");
    assert.equal(prng(), 0.9282578795792454, "Should be 'hello.'#1");
    return 'zzz';
});
assert.equal(result, 'zzz', "Should return value from callback.");
assert(original === Math.random, "Should not change Math.random.");

// Global: false.
it("should be able to use new Math.seedrandom('hello.', {global: false})");
myrng = new Math.seedrandom('hello.', {global:false});
assert.equal(typeof(myrng), 'function', "Should return a PRNG funciton.");
assert(original === Math.random, "Should not change Math.random.");
assert(original !== myrng, "PRNG should not be Math.random.");
r = myrng();
assert.equal(r, 0.9282578795792454, "Should be 'hello.'#1");

// options = {} when a method of Math.
it("should be able to use Math.seedrandom('hello.', {})");
var result = Math.seedrandom('hello.');
var xprng = Math.random;
assert(original !== xprng, "Should change Math.random.");
assert.equal(result, "hello.", "Should return short seed.");
var r = Math.random();
assert.equal(r, 0.9282578795792454, "Should be 'hello.'#1");
r = Math.random();
assert.equal(r, 0.3752569768646784, "Should be 'hello.'#2");
Math.random = original;

// options = {} when not a method of Math
it("should be able to use seedrandom('hello.', {})");
rng = seedrandom('hello.', {});
assert.equal(typeof(rng), 'function', "Should return a function.");
r = rng();
assert.equal(r, 0.9282578795792454, "Should be 'hello.'#1");
assert(original === Math.random, "Should not change Math.random.");
assert(original !== rng, "PRNG should not be Math.random.");

it('should seed using the legacy Math API with hello.');
result = Math.seedrandom('hello.');
var firstprng = Math.random;
assert(original !== firstprng, "Should change Math.random.");
assert.equal(result, "hello.", "Should return short seed.");
r = Math.random();
assert.equal(r, 0.9282578795792454, "Should be 'hello.'#1");
r = Math.random();
assert.equal(r, 0.3752569768646784, "Should be 'hello.'#2");

it('should be able to autoseed');
result = Math.seedrandom();
var secondprng = Math.random;
assert(original !== secondprng, "Should change Math.random.");
assert(firstprng !== secondprng, "Should change Math.random.");
assert.equal(result.length, 256, "Should return short seed.");
r = Math.random();
assert(r > 0, "Should be posititive.");
assert(r < 1, "Should be less than 1.");
assert(r != 0.9282578795792454, "Should not be 'hello.'#1");
assert(r != 0.3752569768646784, "Should not be 'hello.'#2");
assert(r != 0.7316977468919549, "Should not be 'hello.'#3");
var autoseed1 = r;

it('should be able to add entropy.');
result = Math.seedrandom('added entropy.', { entropy:true });
assert.equal(result.length, 256, "Should return short seed.");
var thirdprng = Math.random;
assert(thirdprng !== secondprng, "Should change Math.random.");
r = Math.random();
assert(r != 0.597067214994467, "Should not be 'added entropy.'#1");

// Reset to original Math.random.
Math.random = original;
it("should be able to use new Math.seedrandom('hello.')");
var myrng = new Math.seedrandom('hello.');
assert(original === Math.random, "Should not change Math.random.");
assert(original !== myrng, "PRNG should not be Math.random.");
r = myrng();
assert.equal(r, 0.9282578795792454, "Should be 'hello.'#1");

});
