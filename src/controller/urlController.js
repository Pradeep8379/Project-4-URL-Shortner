
const urlModel = require("../model/urlModel");
const shortid = require('shortid')
const validUrl=/^([hH][tT][tT][pP]([sS])?:\/\/.)(www\.)?[-a-zA-Z0-9@:%.\+#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%\+.#?&//=_]*$)/g;




const baseUrl = 'http://localhost:3000'


const urlShortner = async function (req, res) {

    try {
        let longUrl = req.body.longUrl;

        // checking if url is present.
        if (!longUrl) {
            return res.status(400).send({ status: false, message: "url is required..." })
        }

        // checking if url is valid or not.
        if (!validUrl.test(longUrl)) {
          
            return res.status(400).send({ status: false, message: "url is inValid..." })
        }
        //-----checking in present in db-----------

        const findUrl = await urlModel.findOne({ longUrl }).select({createdAt:0,updatedAt:0,_id:0,__v:0})
        if (findUrl) {
            return res.status(200).send({ status: true,message: "shortUrl already exists", data: findUrl})
        }
        const urlCode = shortid.generate(longUrl)

        const shortUrl = baseUrl + '/' + urlCode


        let urlBody = {
            longUrl: longUrl,
            shortUrl: shortUrl,
            urlCode: urlCode
        }


        await urlModel.create(urlBody)
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

        const findUrl = await urlModel.findOne({ urlCode })

        if (!findUrl) {
            return res.status(400).send({ status: false, message: "shortUrl doesn't exist in db..." })
        }

        return res.status(302).redirect(findUrl.longUrl)

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

module.exports.urlShortner = urlShortner;
module.exports.getUrl = getUrl



