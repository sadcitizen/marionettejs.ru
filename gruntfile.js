module.exports = function(grunt) {

    var banner = '/*! <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd hh:MM:ss TT Z") %> */\n\n' +
        '/*\n' +
        '+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+\n' +
        '|m|a|r|i|o|n|e|t|t|e|j|s|.|r|u|\n' +
        '+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+\n' +
        '*/\n\n';

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        meta: {
            public: './public/',
            styles: './styles/'
        },

        sass: {
            styles: {
                files: {
                    '<%= meta.public %>css/styles.css': '<%= meta.styles %>styles.scss'
                }
            }
        },

        autoprefixer: {
            options: {
                browsers: ['last 2 version', 'ie 8', 'ie 9'],
                diff: true
            },

            styles: {
                src: '<%= meta.public %>css/styles.css',
                dest: '<%= meta.public %>css/styles.prefixed.css'
            }
        },

        watch: {
            styles: {
                files: ['<%= meta.styles %>**/*.scss'],
                tasks: ['styles']
            }
        },

        cssmin: {
            production: {
                files: {
                    '<%= meta.public %>css/styles.min.css': '<%= meta.public %>css/styles.prefixed.css'
                },
                options: {
                    banner: banner
                }
            }
        },

        clean: {
            styles: {
                src: ['<%= meta.public %>css/styles.css', '<%= meta.public %>css/styles.prefixed.css']
            }
        }
    });


    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-clean');

    grunt.registerTask('default', ['watch']);
    grunt.registerTask('styles', [
        'sass',
        'autoprefixer',
        'cssmin',
        'clean'
    ]);
};