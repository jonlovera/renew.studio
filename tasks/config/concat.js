/**
 * Concatenate files.
 *
 * ---------------------------------------------------------------
 *
 * Concatenates files javascript and css from a defined array. Creates concatenated files in
 * .tmp/public/contact directory
 * [concat](https://github.com/gruntjs/grunt-contrib-concat)
 *
 * For usage docs see:
 * 		https://github.com/gruntjs/grunt-contrib-concat
 */
module.exports = function(grunt) {

	grunt.config.set('concat', {
		js: {
			src: require('../pipeline').jsFilesToConcatProd,
			dest: '.tmp/public/js/production.js'
		},
		css: {
			src: require('../pipeline').cssFilesToConcatProd,
			dest: '.tmp/public/css/production.css'
		}
	});

	grunt.loadNpmTasks('grunt-contrib-concat');
};
