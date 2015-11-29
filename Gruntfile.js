module.exports = function(grunt) {
	// Add our custom tasks.
  
  
	grunt.initConfig({
		mochacli: {
			all: ['ejemplo/test/**/*.js'],
			options: {
				bail: true
			},
		  },
	});

	grunt.loadNpmTasks('grunt-mocha-cli');
	
	grunt.registerTask('default', ['mochacli']);
};