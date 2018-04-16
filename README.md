# asciicast tools

Tools for creating recordings of console sessions.

Recordings are in [asciicast format][asciicast-format], thus can be played
back on https://asciinema.org/.

[asciicast-format]: https://github.com/asciinema/asciinema/blob/develop/doc/asciicast-v2.md

## Commands

## `asciicast`

Convert input to [asciicast v2 format][asciicast-format].

By default the script will attempt to detect the correct terminal settings, but
this can be overridden using command-line flags.

## `tmux-asciicast-pane`

Helper-script for recording output from a [tmux](https://tmux.github.io) pane.

To start recording the current tmux pane, provide an output file to write the
asciicast:

```bash
$ tmux-asciicast-pane output.cast
```

To stop recording, just run without any output file specified:

```bash
$ tmux-asciicast-pane
```

## License

Copyright © 2018 David Coles

All code is licensed under MIT License. See LICENSE for details.
