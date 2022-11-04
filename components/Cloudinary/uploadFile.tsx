import { hygraph } from '../Hygraph';

interface VideoProperties {
  title: string;
  description: string;
}

export function uploadFile(
  file: Blob,
  cloudName: string,
  onSuccess: Function,
  onError: Function,
  props: VideoProperties
) {
  var url = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;
  var xhr = new XMLHttpRequest();
  var fd = new FormData();
  xhr.open('POST', url, true);
  xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

  // Reset the upload progress bar
  // document.getElementById('progress').style.width = 0;

  // Update progress (can be used to show progress indicator)
  xhr.upload.addEventListener('progress', function (e) {
    var progress = Math.round((e.loaded * 100.0) / e.total);
    //document.getElementById('progress').style.width = progress + '%';

    console.log(`fileuploadprogress data.loaded: ${e.loaded},
    data.total: ${e.total}`);
  });

  xhr.onreadystatechange = async function (e) {
    //alert('yes');
    if (xhr.readyState == 4 && xhr.status == 200) {
      // File uploaded successfully
      var response = JSON.parse(xhr.responseText);
      // https://res.cloudinary.com/cloudName/image/upload/v1483481128/public_id.jpg
      var url = response.secure_url;
      // Create a thumbnail of the uploaded image, with 150px width
      var tokens = url.split('/');

      const res = await hygraph.request(
        `
      mutation CreateVideo($title:String, $slug:String, $description:String) {
        createVideo(data: { title: $title, cloudinaryId: $slug, description:$description, views:1,upvotes:1}) {
          id
          title
          cloudinaryId
          description
          views
          upvotes
        }
      }`,
        { title: props.title, description: props.description, slug: response.secure_url }
      );

      onSuccess();
      alert(JSON.stringify(res));
      //document.getElementById('gallery').appendChild(img);
    } else {
    }
  };

  xhr.onerror = function (e) {
    onError();
  };
  xhr.onabort = function (e) {
    onError();
  };
  // xhr.on
  fd.append('upload_preset', 'eniv_video_main_upload_preset'); //unsignedUploadPreset);
  fd.append('tags', 'browser_upload'); // Optional - add tag for image admin in Cloudinary
  fd.append('file', file);
  xhr.send(fd);
}
