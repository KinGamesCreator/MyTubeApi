const ytdl = require('ytdl-core');
const ytsr = require('ytsr');
const ytt = require('node-ytt');
const express = require('express');
app = express();

app.get('/getRawURL', async (req, res, next) => {
	try {
		let url = req.query.url;
		if(!ytdl.validateID(url)) {
			return res.send("Invalid ID");
		}
		res.send(await (await ytdl.getInfo(url)).player_response.streamingData.formats[0].url)
	} catch (err) {
		console.error(err);
	}
});

app.get('/getVideoByString', async (req, res, next) => {
	try {
		if(!req.query.sr){return res.send("Input missing");}

		var filter = await ytsr.getFilters(req.query.sr);
		filter = filter.get('Type').get('Video');
		var r = await (await ytsr(filter.url, {limit: 40})).items;

		var temparr = [];

		for(let i = 0; i < r.length; i++){
			temparr.push({thumbnail: `https://i.ytimg.com/vi/${r[i]["id"]}/mqdefault.jpg`, video_id: r[i]["id"]});
		}

		res.json(temparr.length);
	} catch (err) {
		console.error(err);
	}
});

app.get('/getTrending', async (req, res, next) => {
	try {
		var temparr = [];

		ytt(async (r) => {
			for(let i = 0; i < r.length; i++){
				temparr.push({thumbnail: `https://i.ytimg.com/vi/${r[i]["video_id"]}/mqdefault.jpg`, video_id: r[i]["video_id"]})
			}
			res.send(temparr);
		})
	} catch (err) {
		console.error(err);
	}
});

app.listen(3000, ()=>{
    console.log('Running on port 3000');
})