import { Cloudinary } from '@cloudinary/url-gen';

export const cloudName = 'disniioii';
export { cloudName as cloudinaryCloudName };
export const cloudinary = new Cloudinary({ cloud: { cloudName } });
