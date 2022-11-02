import cloudinary from 'cloudinary';
import { IncomingForm } from 'formidable';
import { NextApiRequest, NextApiResponse } from 'next';

cloudinary.config({
  cloud_name: 'disniioii',
  api_key: '983597853818463',
  api_secret: '0zt0vFJLfxbewsTIeN5sERUaAgc',
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async (req, res) => {
  const data = await new Promise((resolve, reject) => {
    const form = new IncomingForm();

    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });

  console.log('data: ', JSON.stringify(data));
  const file = data?.files?.inputFile.filepath;
  const vidTitle = data?.fields.vidTitle;
  console.log('FilePath: ', file);

  const slug = encodeURIComponent(
    new String(vidTitle).toLowerCase().replace(/ /g, '-') + '-' + getRandomInt(1, 100000)
  );

  console.log(JSON.stringify(slug));
  const response = await cloudinary.v2.uploader.upload(file, {
    resource_type: 'video',
    public_id: slug,
    folder: 'enivVideos',
  });
  console.log('Uploaded to Cloudinary');
  return res.json({ abc: 'c' });
  //return res.json(response);
};
/**
 * Returns a random number between min (inclusive) and max (exclusive)
 */
function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive).
 * The value is no lower than min (or the next integer greater than min
 * if min isn't an integer) and no greater than max (or the next integer
 * lower than max if max isn't an integer).
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
