@lppx/ali
=================

aliyun cli tool


[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@lppx/ali.svg)](https://npmjs.org/package/@lppx/ali)
[![Downloads/week](https://img.shields.io/npm/dw/@lppx/ali.svg)](https://npmjs.org/package/@lppx/ali)


<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g @lppx/ali
$ ali COMMAND
running command...
$ ali (--version)
@lppx/ali/0.0.1 linux-x64 node-v22.22.3
$ ali --help [COMMAND]
USAGE
  $ ali COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`ali autocomplete [SHELL]`](#ali-autocomplete-shell)
* [`ali help [COMMAND]`](#ali-help-command)
* [`ali version`](#ali-version)

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

## `ali help [COMMAND]`

Display help for ali.

```
USAGE
  $ ali help [COMMAND...] [-n]

ARGUMENTS
  [COMMAND...]  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for ali.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/6.2.45/src/commands/help.ts)_

## `ali version`

```
USAGE
  $ ali version [--json] [--verbose]

FLAGS
  --verbose  Show additional information about the CLI.

GLOBAL FLAGS
  --json  Format output as json.

FLAG DESCRIPTIONS
  --verbose  Show additional information about the CLI.

    Additionally shows the architecture, node version, operating system, and versions of plugins that the CLI is using.
```

_See code: [@oclif/plugin-version](https://github.com/oclif/plugin-version/blob/2.2.42/src/commands/version.ts)_
<!-- commandsstop -->
