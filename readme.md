# random-access-keychain

A [random-access-storage](https://github.com/random-access-storage/random-access-storage) implementation which stores its contents in the system keychain. This is useful if you want to store secret keys or passwords securely.

This module should work on macOS, Linux and Windows. Check the [keytar](http://atom.github.io/node-keytar/) documentation for details on required dependencies on Linux.

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
