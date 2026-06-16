# QSON - Query String Object Notation

## What is QSON

A JSON-like notation that can safely be used to store and transport JSON compatible data in URL query strings. It maintains decent human readability while being compatible with WHATWG standard and most tools and systems that handle query strings. By default, produced QSON strings and query strings are canonical for efficient usage as cache keys.

### Capabilities:

- Deterministic. Many systems use guesswork to determine data types when parsing query strings. "If it looks like a number, it must be a number" and "if it doesn't match any specific type, it must be a string". QSON has JSON-style deterministic serializing and parsing.
- Somewhat human readable. JSON can be transferred as base64 encoded but this completely loses human readability unless it is decoded first. From QSON you can easily read data structure, numbers, booleans and null. Strings and object keys are percent-encoded so they maintain some human-readability unless they contain mostly characters that must be percent encoded e.g. characters completely outside ASCII plane.
- JSON API compatible. Anything that can be serialized to JSON and parsed back should also be able to be serialized to QSON and parsed back.

## What QSON is not

Not a JSON replacement. JSON is still faster, more human-readable and also human-writable.

Not 100% compatible with all other tools and systems. If a QSON or QSON-containing query string is passed through percent decoder, the QSON structure can become corrupted.

## Licensing

The QSON JavaScript implementation, source code, tests, and build tooling are licensed under the MIT Licence. See LICENCE.

The QSON specification and documents under the /spec directory are licensed under the Creative Commons Attribution 4.0 International License (CC BY 4.0). See spec/LICENCE.

This separation allows unrestricted use of the implementation while enabling reuse of the specification text with attribution.
