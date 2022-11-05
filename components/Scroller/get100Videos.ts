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
    }
  }
  `);
  callback(res.videos);
}
