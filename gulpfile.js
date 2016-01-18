var gulp=require("gulp")
var concat=require("gulp-concat")

gulp.task("default", function() {
    return gulp.src(["./src/js.js","./src/angular-validation-rules.js","./src/angular-validation-directive.js","./src/angular-validation-service.js"])
	    .pipe(concat("dao-valid-angular.js"))
	    .pipe(gulp.dest("./"))
})
