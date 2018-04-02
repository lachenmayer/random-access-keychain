const test = require('tape')
const rak = require('./')

test('arguments are required', function(t) {
  t.throws(() => rak(), 'service is required', 'service is required')
  t.throws(() => rak('foo'), 'account is required', 'account is required')
  t.end()
})

test('write and read', function(t) {
  const storage = rak('random-access-keychain-test', 'happy-case')

  storage.write(0, Buffer.from('works'), function(err) {
    t.error(err, 'no error')
    storage.read(0, 5, function(err, buf) {
      t.error(err, 'no error')
      t.same(buf, Buffer.from('works'))
      t.end()
    })
  })
})

test('read before write', function(t) {
  const storage = rak('random-access-keychain-test', 'does-not-exist')
  storage.read(0, 1, function(err, password) {
    t.is(err.code, 'PasswordNotFound')
    t.end()
  })
})

test('write with offset', function(t) {
  const storage = rak('random-access-keychain-test', 'with-offset')
  storage.write(2, Buffer.from('world'), function(err) {
    t.error(err, 'no error')
    storage.read(2, 5, function(err, buf) {
      t.error(err, 'no error')
      t.same(buf, Buffer.from('world'))
      t.end()
    })
  })
})

test('read past end', function(t) {
  const storage = rak('random-access-keychain-test', 'read-past-end')

  storage.write(0, Buffer.from('x'), function(err) {
    t.error(err, 'no error')
    storage.read(0, 2, function(err, buf) {
      t.ok(err, 'error: could not satisfy length')
      t.end()
    })
  })
})

test('write past end', function(t) {
  const storage = rak('random-access-keychain-test', 'write-past-end')

  storage.write(0, Buffer.from('works'), function(err) {
    t.error(err, 'no error')
    storage.write(5, Buffer.from('ucks'), function(err) {
      t.error(err, 'no error')
      storage.read(0, 9, function(err, buf) {
        t.error(err, 'no error')
        t.same(buf, Buffer.from('worksucks'))
        t.end()
      })
    })
  })
})
