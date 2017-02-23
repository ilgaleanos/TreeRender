module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		browserify: {
			dist: {
				options: {
					watch: true,
					keepAlive: true,
					transform: [
						['babelify',
							{
								"presets": ["es2015", 'stage-0'],
								"plugins": [
									["transform-react-jsx", {
										"pragma": "T"
									}],
									["transform-decorators-legacy"]
								]
							}
						]
					]
				},
				src: ['app/main/main.j*'],
				dest: './static/build/build.js'
			}
		},
		watch: {
			browserify: {
				files: ['app/**/*.j*'],
				tasks: ['browserify']
			},
		}
	});

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-browserify');
	grunt.registerTask('default', ['watch']);
};
