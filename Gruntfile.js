module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        
        markdown: {
          all: {
            files: [
              {
                expand: true,
                src: 'md/en/*.md',
                dest: 'html/en/',
                ext: '.html'
              }
            ]
          }
        }
    });
    
    grunt.loadNpmTasks('grunt-markdown');
    grunt.registerTask('default', ['markdown']);
};