var profile = (function (){

    var miniExcludes = {
            "LICENSE": 1,
            "dojo-sm2-playlist/package": 1,
            "dojo-sm2-playlist/package.json": 1,
            "readme.md": 1
        }
    ;

    return {
        resourceTags: {
            miniExclude: function (filename, moduleId) {
                return moduleId in miniExcludes;
            },

            amd: function (filename, moduleId) {
                return /\.js$/.test(filename);
            }
        }
    };
})();