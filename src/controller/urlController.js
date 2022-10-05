
const urlModel = require("../model/urlModel");
const shortid = require('shortid')
const redis = require("redis");
const { promisify } = require("util");

//Connect to redis
const redisClient = redis.createClient(
    13699,
    "redis-13699.c93.us-east-1-3.ec2.cloud.redislabs.com",
    { no_ready_check: true }
);
redisClient.auth("R0EmiHgWEgvf0ZN4yqz6qmY8dlOMwJcB", function (err) {
    if (err) throw err;
});

redisClient.on("connect", async function () {
    console.log("Connected to Redis..");
});

//1. connect to the server
//2. use the commands :
//Connection setup for redis

const SET_ASYNC = promisify(redisClient.SET).bind(redisClient);
const GET_ASYNC = promisify(redisClient.GET).bind(redisClient);


const baseUrl = 'http://localhost:3000'


const urlShortner = async function (req, res) {

    try {
        let longUrl = req.body.longUrl;

        // checking if url is present.
        if (!longUrl) {
            return res.status(400).send({ status: false, message: "url is required..." })
        }

        //--------------------check url regex -----------------------

        if (!/^([hH][tT][tT][pP]([sS])?:\/\/.)(www\.)?[-a-zA-Z0-9@:%.\+#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%\+.#?&//=_]*$)/g.test(longUrl)) {
            return res.status(400).send({ status: false, message: "url is inValid..." })
        }


        let profile = await GET_ASYNC(`${longUrl}`)

        if (profile) {
            return res.status(200).send({
                status: true,
                message: " url Already Exists in cache..",
                data: JSON.parse(profile)
            });
        }

        const urlCode = shortid.generate(longUrl).toLowerCase();

        const shortUrl = baseUrl + '/' + urlCode

        let urlBody = {
            longUrl: longUrl,
            shortUrl: shortUrl,
            urlCode: urlCode
        }
        let data = await urlModel.create(urlBody)

        await SET_ASYNC(`${longUrl}`, JSON.stringify(urlBody))

        // await urlModel.create(urlBody)
        return res.status(201).send({ status: true, message: "shortUrl successfully created", data: urlBody })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }

}
///--------------get Url api--------------------

const getUrl = async function (req, res) {
    try {
        let urlCode = req.params.urlCode

        if (!urlCode) {
            return res.status(400).send({ status: false, message: "shorturl is required..." })
        }

        let profile = await GET_ASYNC(`${urlCode}`)

        console.log(profile)
        if (profile) {
            let data = JSON.parse(profile)
            return res.status(302).redirect(data)
        }

        else {
            let profile = await urlModel.findOne({ urlCode });

            if (!profile) {
                return res.status(400).send({ status: false, message: "shortUrl doesn't exist in db..." })
            }

            await SET_ASYNC(`${req.params.urlCode}`, JSON.stringify(profile.longUrl))

            return res.status(302).redirect(profile.longUrl)
        }

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

module.exports.urlShortner = urlShortner;
module.exports.getUrl = getUrl



