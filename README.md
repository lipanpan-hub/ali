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
@lppx/ali/0.0.0 win32-x64 node-v24.14.1
$ ali --help [COMMAND]
USAGE
  $ ali COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`ali hello PERSON`](#ali-hello-person)
* [`ali hello world`](#ali-hello-world)
* [`ali help [COMMAND]`](#ali-help-command)
* [`ali plugins`](#ali-plugins)
* [`ali plugins add PLUGIN`](#ali-plugins-add-plugin)
* [`ali plugins:inspect PLUGIN...`](#ali-pluginsinspect-plugin)
* [`ali plugins install PLUGIN`](#ali-plugins-install-plugin)
* [`ali plugins link PATH`](#ali-plugins-link-path)
* [`ali plugins remove [PLUGIN]`](#ali-plugins-remove-plugin)
* [`ali plugins reset`](#ali-plugins-reset)
* [`ali plugins uninstall [PLUGIN]`](#ali-plugins-uninstall-plugin)
* [`ali plugins unlink [PLUGIN]`](#ali-plugins-unlink-plugin)
* [`ali plugins update`](#ali-plugins-update)

## `ali hello PERSON`

Say hello

```
USAGE
  $ ali hello PERSON -f <value>

ARGUMENTS
  PERSON  Person to say hello to

FLAGS
  -f, --from=<value>  (required) Who is saying hello

DESCRIPTION
  Say hello

EXAMPLES
  $ ali hello friend --from oclif
  hello friend from oclif! (./src/commands/hello/index.ts)
```

_See code: [src/commands/hello/index.ts](https://github.com/lipanpan-hub/ali/blob/v0.0.0/src/commands/hello/index.ts)_

## `ali hello world`

Say hello world

```
USAGE
  $ ali hello world

DESCRIPTION
  Say hello world

EXAMPLES
  $ ali hello world
  hello world! (./src/commands/hello/world.ts)
```

_See code: [src/commands/hello/world.ts](https://github.com/lipanpan-hub/ali/blob/v0.0.0/src/commands/hello/world.ts)_

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

## `ali plugins`

List installed plugins.

```
USAGE
  $ ali plugins [--json] [--core]

FLAGS
  --core  Show core plugins.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ ali plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/5.4.62/src/commands/plugins/index.ts)_

## `ali plugins add PLUGIN`

Installs a plugin into ali.

```
USAGE
  $ ali plugins add PLUGIN... [--json] [-f] [-h] [-s | -v]

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Force npm to fetch remote resources even if a local copy exists on disk.
  -h, --help     Show CLI help.
  -s, --silent   Silences npm output.
  -v, --verbose  Show verbose npm output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into ali.

  Uses npm to install plugins.

  Installation of a user-installed plugin will override a core plugin.

  Use the ALI_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the ALI_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ ali plugins add

EXAMPLES
  Install a plugin from npm registry.

    $ ali plugins add myplugin

  Install a plugin from a github url.

    $ ali plugins add https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ ali plugins add someuser/someplugin
```

## `ali plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ ali plugins inspect PLUGIN...

ARGUMENTS
  PLUGIN...  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ ali plugins inspect myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/5.4.62/src/commands/plugins/inspect.ts)_

## `ali plugins install PLUGIN`

Installs a plugin into ali.

```
USAGE
  $ ali plugins install PLUGIN... [--json] [-f] [-h] [-s | -v]

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Force npm to fetch remote resources even if a local copy exists on disk.
  -h, --help     Show CLI help.
  -s, --silent   Silences npm output.
  -v, --verbose  Show verbose npm output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into ali.

  Uses npm to install plugins.

  Installation of a user-installed plugin will override a core plugin.

  Use the ALI_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the ALI_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ ali plugins add

EXAMPLES
  Install a plugin from npm registry.

    $ ali plugins install myplugin

  Install a plugin from a github url.

    $ ali plugins install https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ ali plugins install someuser/someplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/5.4.62/src/commands/plugins/install.ts)_

## `ali plugins link PATH`

Links a plugin into the CLI for development.

```
USAGE
  $ ali plugins link PATH [-h] [--install] [-v]

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help          Show CLI help.
  -v, --verbose
      --[no-]install  Install dependencies after linking the plugin.

DESCRIPTION
  Links a plugin into the CLI for development.

  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.


EXAMPLES
  $ ali plugins link myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/5.4.62/src/commands/plugins/link.ts)_

## `ali plugins remove [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ ali plugins remove [PLUGIN...] [-h] [-v]

ARGUMENTS
  [PLUGIN...]  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ ali plugins unlink
  $ ali plugins remove

EXAMPLES
  $ ali plugins remove myplugin
```

## `ali plugins reset`

Remove all user-installed and linked plugins.

```
USAGE
  $ ali plugins reset [--hard] [--reinstall]

FLAGS
  --hard       Delete node_modules and package manager related files in addition to uninstalling plugins.
  --reinstall  Reinstall all plugins after uninstalling.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/5.4.62/src/commands/plugins/reset.ts)_

## `ali plugins uninstall [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ ali plugins uninstall [PLUGIN...] [-h] [-v]

ARGUMENTS
  [PLUGIN...]  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ ali plugins unlink
  $ ali plugins remove

EXAMPLES
  $ ali plugins uninstall myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/5.4.62/src/commands/plugins/uninstall.ts)_

## `ali plugins unlink [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ ali plugins unlink [PLUGIN...] [-h] [-v]

ARGUMENTS
  [PLUGIN...]  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ ali plugins unlink
  $ ali plugins remove

EXAMPLES
  $ ali plugins unlink myplugin
```

## `ali plugins update`

Update installed plugins.

```
USAGE
  $ ali plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/5.4.62/src/commands/plugins/update.ts)_
<!-- commandsstop -->
