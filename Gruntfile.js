module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    bower: {
      dev: {
        dest: 'dist/',
        js_dest: 'dist/js',
        css_dest: 'dist/css',
        images_dest: 'dist/img'
      }
    },
    babel: {
      options: {
        sourceMap: true
      },
      dev: {
        files: {
          'dist/js/app.js': 'src/app.js'
        }
      }
    },
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
      
    }
  });
  grunt.loadNpmTasks('grunt-bower');
  grunt.loadNpmTasks('grunt-babel');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.registerTask('default', ['clean', 'htmlmin','bower','babel']);
  grunt.registerTask('serve', ['connect:watch', 'watch']);
};
