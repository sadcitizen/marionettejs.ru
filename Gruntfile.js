module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        markdown: {
            all: {
                files: [
                    {
                        expand: true,
                        src: 'md/ru/marionette.view.md',
                        dest: 'html/',
                        ext: '.html'
                    }
                ]
            }
        }
    });

    grunt.loadNpmTasks('grunt-markdown');
    grunt.registerTask('default', ['markdown']);
};