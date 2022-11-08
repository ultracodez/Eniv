/*
await hygraph.request(`
  mutation getAndUpdateVideos($views:Int) {
    updateVideo(data:{views:$views} where:{cloudinaryId:"https://res.cloudinary.com/disniioii/video/upload/v1667600417/enivVideoBucket/q2tog3k29mdeo0mohmmb.mp4"}) {
      views
    }
  }
  `);
*/

import { HygraphVideoMetadata } from './get100Videos';
import { hygraph } from '../Hygraph';

export async function updateVideoVotes(video: HygraphVideoMetadata, newUpvotes: number) {
  const res = await hygraph.request(`
  mutation getAndUpdateVideos() {
    updateVideo(data:{upvotes:${newUpvotes}} where:{cloudinaryId:"${video.cloudinaryId}"}) {
      upvotes
    }
  }
  `);
  await hygraph.request(
    `
  mutation PublishVideo($cid:String) {
    publishVideo(
      where: {cloudinaryId: $cid}
      to: PUBLISHED
    ) {
      cloudinaryId
      stage
    }
  }
  `,
    { cid: video.cloudinaryId }
  );
  //alert(JSON.stringify(res));
}

export async function updateVideoVerified(
  video: HygraphVideoMetadata,
  newVerificationLevel: boolean
) {
  const res = await hygraph.request(`
  mutation getAndUpdateVideos() {
    updateVideo(data:{verified:${newVerificationLevel}} where:{cloudinaryId:"${video.cloudinaryId}"}) {
      upvotes
    }
  }
  `);
  await hygraph.request(
    `
  mutation PublishVideo($cid:String) {
    publishVideo(
      where: {cloudinaryId: $cid}
      to: PUBLISHED
    ) {
      cloudinaryId
      stage
    }
  }
  `,
    { cid: video.cloudinaryId }
  );
  //alert(JSON.stringify(res));
}

export async function updateVideoViews(video: HygraphVideoMetadata) {
  const res = await hygraph.request(`
  mutation getAndUpdateVideos() {
    updateVideo(data:{views:${video.views + 1}} where:{cloudinaryId:"${video.cloudinaryId}"}) {
      views
    }
  }
  `);
  await hygraph.request(
    `
  mutation PublishVideo($cid:String) {
    publishVideo(
      where: {cloudinaryId: $cid}
      to: PUBLISHED
    ) {
      cloudinaryId
      stage
    }
  }
  `,
    { cid: video.cloudinaryId }
  );
}
