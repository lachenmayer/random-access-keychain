# random-access-keychain

A [random-access-storage](https://github.com/random-access-storage/random-access-storage) instance which stores its contents in the macOS keychain. This is useful if you want to store secret keys or passwords securely.

## API

#### `var storage = randomAccessKeychain(service: string, account: string)`

Implements the `random-access-storage` interface, ie:

- `storage.write(offset: number, buffer: Buffer, callback: (err: Error) => any)`
- `storage.read(offset: number, size: number, callback: (err: Error, content: Buffer) => any)`
- `storage.del(offset: number, size: number, callback: (err: Error) => any)`

## Usage

```js
var randomAccessKeychain = require('random-access-keychain')

var storage = randomAccessKeychain('example.com', 'harry@example.com')
storage.write(0, Buffer.from('supersecret'), err => {
  if (err) throw err
  storage.read(0, 11, (err, password) => {
    if (err) throw err
    console.log('password:', password.toString())
  })
})
```
