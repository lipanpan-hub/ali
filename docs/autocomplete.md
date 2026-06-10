`ali autocomplete`
==================

Display autocomplete installation instructions.

* [`ali autocomplete [SHELL]`](#ali-autocomplete-shell)

## `ali autocomplete [SHELL]`

Display autocomplete installation instructions.

```
USAGE
  $ ali autocomplete [SHELL] [-r]

ARGUMENTS
  [SHELL]  (zsh|bash|powershell) Shell type

FLAGS
  -r, --refresh-cache  Refresh cache (ignores displaying instructions)

DESCRIPTION
  Display autocomplete installation instructions.

EXAMPLES
  $ ali autocomplete

  $ ali autocomplete bash

  $ ali autocomplete zsh

  $ ali autocomplete powershell

  $ ali autocomplete --refresh-cache
```

_See code: [@oclif/plugin-autocomplete](https://github.com/oclif/plugin-autocomplete/blob/v3.2.46/src/commands/autocomplete/index.ts)_
