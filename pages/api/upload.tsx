/* eslint-disable linebreak-style */
import { NextApiRequest, NextApiResponse } from 'next';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import type { PutObjectCommandInput } from '@aws-sdk/client-s3/dist-types/commands';

const client = new S3Client({
  endpoint: 'https://gateway.storjshare.io',
  credentials: {
    secretAccessKey: 'jy2g4hqqctzpfah6ff2rpulpnthablbsekgs7jr3qcpyjzpqp3ns2',
    accessKeyId: 'jxzhz4scr7jmy7qjrirzyfyqhxjq',
  },
});

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const params: PutObjectCommandInput = {
    /** input parameters */
  };
  const cmd = new PutObjectCommand(params);
  res.status(200).json({ name: 'John Doe' });
}
