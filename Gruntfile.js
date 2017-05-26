module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    htmlmin: {
      dev: {
        files : {
          'dist/index.html':'src/index.html'
        }
      }
    },
    clean: {
      folder: ['dist/']
    },
    watch: {
      files: ['src/*'],
      tasks: ['default']
    },
    connect: {
      options: {
        port: 3333,
        hostname: 'localhost',
        open: true,
        base: 'dist',
      },
      watch: {
        options: {
          keepalive: false,
          livereload: true
        }
      },
      dev: {
        options: {
          keepalive: true,
          livereload: true
        }
      }
    },
    browserify: {
      dev: {
        files: {
         'dist/app.js':['src/*.js'] 
        },
        options: {
          transform: ['babelify']
        }
      } 
    }
  });
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.registerTask('default', ['clean', 'htmlmin','browserify']);
  grunt.registerTask('serve', ['connect:watch', 'watch']);
};
