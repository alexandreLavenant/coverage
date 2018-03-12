const puppeteer = require('puppeteer');

const coverageCSS = async (url, filter = '') => {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	// Enable CSS coverage
	await page.coverage.startCSSCoverage();
	// Navigate to page
	await page.goto(url);
	// Disable CSS coverage
	const cssCoverage = await page.coverage.stopCSSCoverage();

	let coverageSummary = [];
	filter = new RegExp(filter);

	for (let css of cssCoverage) {
		// Get coverage only for astatic assets domain
		if (filter.test(css.url)) {
			let totalBytes = css.text.length,
				usedBytes = 0
				;
	
			for (let range of css.ranges) {
				usedBytes += range.end - range.start - 1;
			}
	
			coverageSummary.push({
				url : css.url,
				coverage : (usedBytes * 100 / totalBytes)
			});
		}
	}

	return coverageSummary
};

module.exports = coverageCSS;