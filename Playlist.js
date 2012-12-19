define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/Evented"
], function (
    declare,
    lang,
    Evented
) {
    "use strict";
    
    var Track = declare([Evented], {
        
        id: null,
        
        constructor: function (options) {
            var self = this, i = 0;
            
            var events = [
                'onbufferchange',
                'onconnect',
                'ondataerror',
                'onfinish',
                'onload',
                'onpause',
                'onplay',
                'onresume',
                'onsuspend',
                'onstop',
                'onid3',
                'whileloading',
                'whileplaying'
            ];
            
            for (i = 0; i < events.length; i += 1) {
                options[events[i]] = (function (ev) {
                    return function () {
                        self.emit(ev, { track: self });
                    }
                }(events[i]));
            }
            
            this.id = options.id;
            soundManager.createSound(options);
        }
    });
    
    return declare([], {
        
        tracks: [],
        current: -1,
        
        onready: function () {
            soundManager.onready.apply(soundManager, arguments);
        },
        
        addTrack: function (options) {
            this.tracks.push(new Track(options));
        },
        
        getTrack: function (idx) {
            return this.tracks[idx];
        },
        
        getTracks: function () {
            return this.tracks;
        },
        
        play: function () {
            var sound;
            
            if (this.tracks.length < 1) {
                return;
            }
            
            this.current = (this.current < 0) ? 0 : this.current;
            sound = this.getCurrentSound();
            
            if (!sound) {
                return;
            }
            
            if (!this.isPlaying()) {
                sound.play();
            }
        },
        
        pause: function () {
            var sound = this.getCurrentSound();
            
            if (!sound) {
                return;
            }
            
            if (this.isPlaying()) {
                sound.pause();
            }
        },
        
        isPlaying: function () {
            var sound = this.getCurrentSound();
            return (sound) ? (sound.playState && !sound.paused) : false;
        },
        
        getCurrentSound: function () {
            var track = this.getTrack(this.current);
            return (track) ? soundManager.getSoundById(track.id) : undefined;
        }
    });
});