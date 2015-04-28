var fs = require('fs');
var path = require('path');

module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        bower_concat: {
            bower: {
                dest: 'public/js/bower.js',
                cssDest: 'public/css/bower.css'
            }
        },
        uglify: {
            options: {
                mangle: true,
                sourceMap: true
            },
            bower: {
                src: 'public/js/bower.js',
                dest: 'public/js/bower.min.js'
            },
        }
    });    
    
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-bower-concat');
    
    grunt.registerTask('default', ['bower_concat', 'uglify']);    
};
