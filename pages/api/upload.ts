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

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const data: any = await new Promise((resolve, reject) => {
    const form = new IncomingForm();

    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });

  const file = data?.files?.inputFile.path;

  const response = await cloudinary.v2.uploader.upload(file, {
    resource_type: 'video',
    public_id: 'my_video',
  });
  return res.json(response);
};
