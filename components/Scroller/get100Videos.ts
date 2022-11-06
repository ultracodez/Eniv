import { hygraph } from '../Hygraph';

export default async function get100Videos(callback: Function) {
  const res = await hygraph.request(`
  query get100Videos {
    videos(first:100) {
      id
      title
      cloudinaryId
      upvotes
      views
      publishedAt
      verified
      description
      createdAt
    }
  }
  `);

  callback(res.videos as HygraphVideoMetadata[]);
}

export interface HygraphVideoMetadata {
  id: any;
  title: string;
  cloudinaryId: string;
  upvotes: number;
  views: number;
  publishedAt: string;
  createdAt: string;
  description: string;
  verified: boolean;
}
