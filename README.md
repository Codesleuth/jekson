# jekson

A JSON parser using a projection.

## Usage

Add the package to your project:

```bash
npm i codesleuth/jekson -S
```

Import and use:

```ts
import * as JEKSON from 'jekson';

JEKSON.parse('{"hello":"world","I hate":"life","I love":"you!"}', { 'I love': true });
// { "I love": "you!" }
 
```

## Why?

I want to make a fast and safe JSON parser for JSON bodies POSTed to HTTP servers.

## Contribute

Go for it. This is still an infant. Open a PR.
