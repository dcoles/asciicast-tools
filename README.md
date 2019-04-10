# asciicast tools

Tools for creating recordings of console sessions.

[![image](https://user-images.githubusercontent.com/1007415/55848841-32fd4780-5b03-11e9-919f-b7c232f942a3.png)](https://asciinema.org/a/239501)

Recordings are in [asciicast format][asciicast-format], thus can be played
back on https://asciinema.org/.

[asciicast-format]: https://github.com/asciinema/asciinema/blob/develop/doc/asciicast-v2.md

## Player

This is a [hterm][hterm]-based player for asciicasts. It depends on
`hterm_all.js` which can be built by running
`third_party/libapps/hterm/bin/mkdist.sh` and copying into the player directory
(or using the existing symlink).

[hterm]: https://chromium.googlesource.com/apps/libapps/+/master/hterm

## Commands

## `asciicast-pipe`

A filter to convert input to [asciicast v2 format][asciicast-format].

```
Usage: asciicast-pipe [-h] [-W WIDTH] [-H HEIGHT] [-S SHELL] [-T TERM] [-r]
                      [--encoding ENCODING]

optional arguments:
  -h, --help            show this help message and exit
  -W WIDTH, --width WIDTH
  -H HEIGHT, --height HEIGHT
  -S SHELL, --shell SHELL
  -T TERM, --term TERM
  -r, --force-cr        Force newlines to be treated as CR+NL
  -e, --echo            Echo stdinput to stderr
  --encoding ENCODING
```

By default the script will attempt to detect the correct terminal settings, but
this can be overridden using command-line flags.

This is not expected to be called directly, but rather by a tool like
`tmux pipe-pane` or `scriptreplay`:

```bash
# Convert a typescript+timing information to asciicast
$ scriptreplay -t timing typescript | asciicast-pipe > typescript.cast

# Record terminal session as asciicast
$ script -q -f >(asciicast-pipe > output.cast)
```

`asciicast-pipe` can also be used to capture output from simple programs.
Use `--force-cr` (`-r`) to ensure output contains required carriage returns.

```bash
$ ping -c 4 127.0.0.1 | asciicast-pipe --echo --force-cr > ping.cast
```

## `tmux-asciicast-pane`

Helper-script for recording output from a [tmux](https://tmux.github.io) pane.

```
Usage: tmux-asciicast-pane [path]
```

To start recording the current tmux pane, provide an output file to write the
asciicast:

```bash
$ tmux-asciicast-pane output.cast
```

To stop recording, just run without any output file specified:

```bash
$ tmux-asciicast-pane
```

# Binding to a tmux key

Alternatively you may wish to set up a shortcut in `~/.tmux.conf`:

```
bind-key H pipe-pane -o 'asciicast-pipe -W #{pane_width} -H #{pane_height} -T "${TERM}" -S "${SHELL}" > $HOME/tmux-%Y%m%d%H%M%S.cast' \; display-message 'Toggled logging'
```

Pressing `<tmux-prefix> H` will toggle logging to a file in your home directory.

## License

Copyright © 2018 David Coles

All code is licensed under MIT License. See LICENSE for details.
