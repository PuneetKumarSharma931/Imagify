
const fs = require('fs-extra');
const path = require('path');

const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const generateImage = async (req, res) => {

    const { prompt, size } = req.body;

    const imageSize = size === 'small' ? '256x256' : size === 'medium' ? '512x512' : '1024x1024';

    try {
        
        const response = await openai.createImage({
            prompt,
            n: 1,
            size: imageSize
        });

        const imageUrl = response.data.data[0].url;

        res.status(200).json({
            success: true,
            data: imageUrl
        });

    } catch (error) {
        
        res.status(400).json({
            success: false,
            error: 'The image could not be generated!'
        });
    }
    
}

const imageVariation = async (req, res)=>{

    const { Size } = req.body;
    const fileData = req.file;
    const size = Size === 'small' ? '256x256' : Size === 'medium' ? '512x512' : '1024x1024';

    try {

        const fileName = fileData.filename;
        const filePath = path.join(__dirname, '..', 'uploads', fileName);

        const response = await openai.createImageVariation(
            fs.createReadStream(filePath),
            1,
            size
          );

        const imgUrl = response.data.data[0].url;
        
        fs.remove(filePath, ()=>{});

        res.status(200).json({
            success: true,
            data: imgUrl
        });

    } catch (error) {

        res.status(400).json({
            success: false,
            error: "The image variation could not be generated!!"
        });
    }

}

module.exports = { generateImage, imageVariation };