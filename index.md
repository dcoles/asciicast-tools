---
layout: default
---

[![image](https://user-images.githubusercontent.com/1007415/55848841-32fd4780-5b03-11e9-919f-b7c232f942a3.png)](https://asciinema.org/a/239501)

## Introduction

Originally this project was started as a way of recording from a tmux session using `tmux pipe-pane`. After doing some research I found out there was already the [asciicast format][asciicast-format], so figured it made sense to use that as the interchange format.

As for the question of why not just use `asciinema rec`, I can give a couple of reasons.
First, recording directly from a tmux pane means you can start recording without needing
to start a new shell session (for example the output of an already running program).
Second, I like the idea of small programs that do one thing and one thing well.
Finally (the most selfish reason) is I just wanted to see if it was possible to do 😊.

[asciicast-format]: https://github.com/asciinema/asciinema/blob/develop/doc/asciicast-v2.md

## Player

This is a [hterm][hterm]-based player for asciicasts. It depends on
`hterm_all.js` which can be built by running
`third_party/libapps/hterm/bin/mkdist.sh` and copying into the player directory
(or using the existing symlink).

[hterm]: https://chromium.googlesource.com/apps/libapps/+/master/hterm

A hosted version can be found on [here](https://dcoles.net/asciicast-tools/player).

## License

Copyright © 2018 David Coles

All code is licensed under MIT License. See LICENSE for details.
