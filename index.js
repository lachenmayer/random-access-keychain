const randomAccessStorage = require('random-access-storage')
const keychain = require('keychain')

module.exports = function randomAccessKeychain(service, account) {
  if (typeof service !== 'string') throw new Error('service is required')
  if (typeof account !== 'string') throw new Error('account is required')

  // We store the password in base64, because we can not store null bytes otherwise.

  function getPassword(cb) {
    keychain.getPassword(
      {
        account: account,
        service: service,
      },
      function(err, password) {
        if (err) return cb(err)
        cb(null, Buffer.from(password, 'base64'))
      }
    )
  }

  function setPassword(buffer, cb) {
    keychain.setPassword(
      {
        account: account,
        service: service,
        password: buffer.toString('base64'),
      },
      cb
    )
  }

  return randomAccessStorage({
    read: function(req) {
      getPassword(function(err, password) {
        if (err) return req.callback(err)
        if (req.offset + req.size > password.length) {
          return req.callback(new Error('Could not satisfy length'))
        }
        const res = password.slice(req.offset, req.offset + req.size)
        req.callback(null, res)
      })
    },
    write: function(req) {
      getPassword(function(err, existing) {
        if (err && err.code === 'PasswordNotFound') {
          const size = req.offset + req.data.length
          const buffer = Buffer.alloc(size)
          req.data.copy(buffer, req.offset)
          setPassword(req.data, cb)
        } else if (err) {
          req.callback(err)
        } else {
          if (req.offset + req.data.length > existing.length) {
            const buffer = Buffer.alloc(req.offset + req.data.length)
            existing.copy(buffer, 0, 0, req.offset)
            req.data.copy(buffer, req.offset)
            setPassword(buffer, cb)
          } else {
            req.data.copy(existing, req.offset)
            setPassword(existing, cb)
          }
        }
        function cb(err) {
          req.callback(err)
        }
      })
    },
    stat: function(req) {
      // TODO: You can get much more info using `security find-generic-password`,
      // but we'd have to figure out how to parse the response.
      getPassword(function(err, password) {
        const stat = {
          size: password.length,
        }
        req.callback(err, stat)
      })
    },
  })
}
