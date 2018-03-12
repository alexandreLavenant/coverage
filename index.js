const	config = require('config'),
		schedule = require('node-schedule'),
		coverageCss = require('./src/coverageCSS'),
		Datastore = require('nedb'),
		db = new Datastore({ filename: 'data/coverage', autoload: true })
		;

		
(async () => {
	console.log('Checking coverage started\n');
	const urlsToCheck = config.get('urls');

	for (let urlToCheck of urlsToCheck) {

		schedule.scheduleJob(urlToCheck.schedule, async () => {
			let url = urlToCheck.url;
			console.log(`Checking css coverage for url:${url}`);
			let summary = await coverageCss(url, urlToCheck.filter);

			// Insert in a database
			db.insert({
				url : url,
				summary : summary,
				date : new Date()
			});

			console.log(`Coverage url:${url}\n Summary:${JSON.stringify(summary)}\n`);
		});
	}
})();