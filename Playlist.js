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
        
        constructor: function (trackInfo, soundOptions) {
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
            
            lang.mixin(this, trackInfo);
            
            for (i = 0; i < events.length; i += 1) {
                soundOptions[events[i]] = (function (ev) {
                    return function () {
                        self.emit(ev, { track: self });
                    }
                }(events[i]));
            }
            
            this.id = soundOptions.id;
            soundManager.createSound(soundOptions);
        }
    });
    
    return declare([], {
        
        tracks: [],
        currentIndex: -1,
        
        onready: function () {
            soundManager.onready.apply(soundManager, arguments);
        },
        
        addTrack: function (trackInfo, soundOptions) {
            this.tracks.push(new Track(trackInfo, soundOptions));
            this.currentIndex = (this.currentIndex < 0) ? 0 : this.currentIndex;
        },
        
        getTrack: function (idx) {
            return this.tracks[idx];
        },
        
        getTracks: function () {
            return this.tracks;
        },
        
        play: function () {
            if (!this.tracks.length) { return; }
            this.getCurrentSound().play();
        },
        
        previous: function () {
            if (!this.tracks.length) { return; }
            this.getCurrentSound().stop();
            this.currentIndex = (this.currentIndex === 0) ? this.tracks.length - 1 : this.currentIndex - 1;
            this.getCurrentSound().play();
        },
        
        next: function () {
            if (!this.tracks.length) { return; }
            this.getCurrentSound().stop();
            this.currentIndex = (this.currentIndex === this.tracks.length - 1) ? 0 : this.currentIndex + 1;
            this.getCurrentSound().play();
        },
        
        pause: function () {
            if (!this.tracks.length) { return; }
            this.getCurrentSound().pause();
        },
        
        isPlaying: function () {
            var sound = this.getCurrentSound();
            return (sound) ? (sound.playState && !sound.paused) : false;
        },
        
        getCurrentSound: function () {
            if (!this.tracks.length) { return null; }
            return soundManager.getSoundById(this.getCurrentTrack().id);
        },
        
        getCurrentTrack: function () {
            if (!this.tracks.length) { return null; }
            return this.getTrack(this.currentIndex);
        }
    });
});