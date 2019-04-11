// Copyright (c) 2018 David Coles. All rights reserved.
// Use of this source code is governed by the MIT license that can be found in
// the LICENSE file.

'use strict';

/**
 * async sleep helper.
 */
function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

/**
 * An asciicast rcording.
 */
class Asciicast {
    /**
     * Create an Asciicast object by parsing an asciicast file.
     */
    constructor(str) {
        this.parse(str)
    }

    /**
     * Return the full asciicast header object.
     */
    get header() {
        return this.header_;
    }

    /*
     * Returns a list of all asciicast events in this asciicast.
     */
    get events() {
        return this.events_;
    }

    /*
     * Initial terminal width.
     */
    getWidth() {
        return this.header_['width'];
    }

    /*
     * Initial terminal height.
     */
    getHeight() {
        return this.header_['height'];
    }

    /*
     * Parse asciicast v2 format from a string.
     *
     * https://github.com/asciinema/asciinema/blob/master/doc/asciicast-v2.md
     */
    parse(str) {
        let lines = str.trimRight().split('\n');
        this.header_ = JSON.parse(lines[0]);
        this.events_ = new Array();
        for (let row of lines.slice(1)) {
            this.events_.push(new Asciicast.Event(JSON.parse(row)));
        }
    }
}

/*
 * Helper class for wrapping events in an asciicast stream.
 *
 * See
 * https://github.com/asciinema/asciinema/blob/master/doc/asciicast-v2.md#event-stream
 */
Asciicast.Event = class {
    constructor(event_) {
        this.event_ = event_;
    }

    /*
     * Timestamp in milliseconds.
     */
    get ts() {
        return this.event_[0] * 1000;
    }

    /*
     * Event type ("o" for output, "i" for input)
     */
    get type() {
        return this.event_[1];
    }

    /*
     * Event data.
     */
    get data() {
        return this.event_[2];
    }
}

/*
 * Class for playback of an asciicast stream on a terminal device.
 */
class AsciicastPlayer {
    constructor(terminal, asciicast) {
        if (!terminal) {
            throw "Terminal required";
        }

        // Playback terminal
        this.terminal_ = terminal;

        // Asciicast for playback.
        this.asciicast_ = asciicast;

        // Epoch (reference timestamp for playback)
        this.epoch_ = null;

        // Playback indedx
        this.index_ = 0;

        // Current playback time (ms)
        this.ts_ = 0;

        // Playback state
        this.state_ = AsciicastPlayer.PAUSED;
    }

    /*
     * Get current playback time in seconds.
     */
    get currentTime() {
        this.updateTS_();
        return this.ts_ / 1000.0;  // ms to s
    }

    /*
     * Update internal timestamp.
     */
    updateTS_() {
        if (this.epoch_ !== null) {
            this.ts_ = performance.now() - this.epoch_;
        }
    }

    /*
     * Begin playback of asciicast.
     *
     * If already playing this has no effect.
     * If the stream is paused, resume from the current playback position.
     * If the stream has reached the end, then calling play again will cause it
     * to seek back to the beginning.
     */
    async play() {
        if (this.state_ === AsciicastPlayer.PLAYING) {
            console.log('Already playing')
            return;
        }

        this.state_ = AsciicastPlayer.PLAYING;

        // Seek back to the beginning
        if (this.index_ >= this.asciicast_.events_.length) {
            console.log('At end of file. Looping back to start')
            this.index_ = 0;
            this.ts_ = 0;
        }

        // Reset the epoch
        this.epoch_ = performance.now() - this.ts_;

        // Setup terminal on first frame
        if (this.index_ === 0) {
            this.terminal_.setWidth(this.asciicast_.getWidth());
            this.terminal_.setHeight(this.asciicast_.getHeight());
            this.terminal_.reset();
        }

        // Playback
        let event_ = null;
        while (this.index_ < this.asciicast_.events_.length) {
            event_ = this.asciicast_.events_[this.index_];

            while (event_.ts > this.ts_) {
                if (this.state_ != AsciicastPlayer.PLAYING) {
                    return;
                }
                await sleep(event_.ts - this.ts_);
                this.updateTS_();
            }

            if (event_.type === 'o') {
                // Output
                this.terminal_.io.print(event_.data);
            }

            this.index_++;
        }

        console.log('End of file')
        this.state_ = AsciicastPlayer.PAUSED;
        this.ts_ = event_.ts;
        this.epoch_ = null;
    }

    /*
     * Pause playback of asciicast.
     */
    pause() {
        this.state_ = AsciicastPlayer.PAUSED;
        this.updateTS_();
        this.epoch_ = null;
        console.log('Paused at ' + this.currentTime)
    }
}

AsciicastPlayer.PAUSED = 0
AsciicastPlayer.PLAYING = 1
