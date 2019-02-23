const gulp = require('gulp'); //gulp本体
const sass = require('gulp-sass'); //Sassをコンパイルする
const autoprefixer = require('gulp-autoprefixer'); //ベンダープレフィックス自動付与
const concat = require('gulp-concat'); //ファイルを統合する
const cssmin = require('gulp-cssmin'); //CSSを圧縮する
const rename = require('gulp-rename'); //リネームする
const plumber = require('gulp-plumber'); //watchタスクを中断させない
const notify = require('gulp-notify'); //デスクトップ通知用
const browserSync = require('browser-sync'); //ブラウザシンク
const connectSSI = require('connect-ssi'); //SSI
const imagemin = require('gulp-imagemin'); //画像最適化
const imageminGifsicle = require('imagemin-gifsicle'); //gif
const imageminJpegtran = require('imagemin-jpegtran'); //jpg
const imageminOptipng = require('imagemin-optipng'); //png
const imageminSvgo = require('imagemin-svgo'); //svg
const htmlv = require('gulp-htmlhint'); //HTMLバリデーション
const cssv = require('gulp-csslint'); //CSSバリデーション

const rootPath = '../..';

// Sassコンパイル → ベンダープレフィックス付与 → cssファイル統合 → 書き出し
/////////////////////////////////////////////////////////////////////////////////
gulp.task('sass', function(done){

		// Sassコンパイル
		///////////////////////////////////////
		gulp.src(rootPath + '/_dev/scss/master.scss')
			.pipe(sass({
				outputStyle: 'expanded',
				indentType: 'tab',
				indentWidth: 1,
			})
			.on('error', sass.logError))

			// ベンダープレフィックスを自動付与
			///////////////////////////////////////
			.pipe(autoprefixer({
						browsers: ['last 2 versions'],
						cascade: false
				}))

			// cssファイル統合
			///////////////////////////////////////
			.pipe(concat('master.css'))

			// 結合後圧縮前のcssファイル書き出し
			///////////////////////////////////////
			.pipe(gulp.dest(rootPath + '/common/css'));

	done();
});

// CSS圧縮
/////////////////////////////////////////////////////////////////////////////////
gulp.task('cssmin', function(done){
	gulp.src(rootPath + '/common/css/master.css')
		.pipe(plumber({
			errorHandler: notify.onError('Error: <%= error.message %>')
		}))
		.pipe(cssmin())
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest(rootPath + '/common/css/min'))
		.pipe(browserSync.stream())
		done();
});

// Sassコンパイル → CSS圧縮タスク
/////////////////////////////////////////////////////////////////////////////////
gulp.task('css', gulp.series('sass', 'cssmin'));

// ウォッチタスク（ファイルの更新を監視）
/////////////////////////////////////////////////////////////
gulp.task('watch', function(done){
	gulp.watch(rootPath + '/_dev/scss/master.scss', gulp.task('css'));
	done();
});

// ブラウザシンク
/////////////////////////////////////////////////////////////////////////////////
gulp.task('browser-sync', function(done){
	browserSync({
		server: {
		baseDir: '/',
		middleware: [
			connectSSI({
				ext: '.html',
				baseDir: '/'
			})
			]
		}
	});
	done();
});

// 画像最適化
/////////////////////////////////////////////////////////////////////////////////
// gulp.task('imagemin', function(done){
// 	gulp.src('docs/img/*.{png,jpg,gif,svg}')
// 		.pipe(imagemin([
// 			imageminGifsicle({interlaced: true}),
// 			imageminJpegtran({progressive: true}),
// 			imageminOptipng({optimizationLevel: 4}),
// 			imageminSvgo({
// 			plugins: [
// 				{removeViewBox: false}
// 				]
// 			})
// 		]))
// 	.pipe(gulp.dest('htdocs/img'))
// 	done();
// });

// HTMLバリデーション
/////////////////////////////////////////////////////////////////////////////////
// gulp.task('htmlv', function(done){
// 	gulp.src('htdocs/*.html')
// 	.pipe(htmlv())
// 	.pipe(htmlv.reporter())
// 	done();
// });

// CSSバリデーション
/////////////////////////////////////////////////////////////////////////////////
// gulp.task('cssv', function(done){
// 	gulp.src('htdocs/css/s.min.css')
// 	.pipe(cssv({
// 		'adjoining-classes': false,
// 		'box-model': false,
// 		'box-sizing': false,
// 		'bulletproof-font-face': false,
// 		'compatible-vendor-prefixes': false,
// 		'empty-rules': true,
// 		'display-property-grouping': true,
// 		'duplicate-background-images': false,
// 		'duplicate-properties': true,
// 		'fallback-colors': false,
// 		'floats': false,
// 		'font-faces': false,
// 		'font-sizes': false,
// 		'gradients': false,
// 		'ids': false,
// 		'import': false,
// 		'important': false,
// 		'known-properties': true,
// 		'order-alphabetical': false,
// 		'outline-none': true,
// 		'overqualified-elements': false,
// 		'qualified-headings': false,
// 		'regex-selectors': false,
// 		'shorthand': false,
// 		'star-property-hack': false,
// 		'text-indent': false,
// 		'underscore-property-hack': false,
// 		'unique-headings': false,
// 		'universal-selector': false,
// 		'unqualified-attributes': false,
// 		'vendor-prefix': false,
// 		'zero-units': true
// 	}))
// 	.pipe(cssv.formatter('compact'))
// 	done();
// });

// デフォルトタスク
/////////////////////////////////////////////////////////////
gulp.task('default', gulp.parallel('watch'/*, 'browser-sync'*/));
