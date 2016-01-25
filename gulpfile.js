var gulp=require("gulp")
var concat=require("gulp-concat")

gulp.task("default", function() {
    return gulp.src(["./src/js.js","./src/angular-validation-rules.js","./src/angular-validation-directive.js"])
	    .pipe(concat("dao-angular-valid.js"))
	    .pipe(gulp.dest("./"))
})
