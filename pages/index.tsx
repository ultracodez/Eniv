import { useEffect } from 'react';
import { getJsonFromUrl } from '../components/helpers/getJsonFromUrl';
import VideoScroller from '../components/Scroller/Scroller';

export default function IndexPage() {
  var params: any;
  if (typeof window !== 'undefined') params = getJsonFromUrl(window?.location?.search);
  //make sure the user didnt come from nextjs routing
  useEffect(() => {
    //alert(JSON.stringify(params));
    if (params.cameFromNextJSRouting) window.location.replace('/'); //alert('you came from client side routing');
  }, []);
  return (
    <>
      <VideoScroller />
    </>
  );
}
