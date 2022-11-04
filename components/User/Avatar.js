import React, { useEffect, useState } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { Center, Overlay } from '@mantine/core';
import { useHover } from '@mantine/hooks';
import { IconCamera } from '@supabase/ui';
import { IconFileUpload } from '@tabler/icons';

export default function Avatar({ uid, url, size, onUpload }) {
  const supabase = useSupabaseClient();
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const { hovered, ref } = useHover();
  const { iconHovered, iconRef } = useHover();
  
  useEffect(() => {
    if (url) downloadImage(url);
  }, [url]);

  async function downloadImage(path) {
    try {
      const { data, error } = await supabase.storage.from('avatars').download(path);
      if (error) {
        throw error;
      }
      const url = URL.createObjectURL(data);
      setAvatarUrl(url);
    } catch (error) {
      console.log('Error downloading image: ', error);
    }
  }

  const uploadAvatar = async (event) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${uid}.${fileExt}`;
      const filePath = `${fileName}`;

      let { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        throw uploadError;
      }

      onUpload(filePath);
    } catch (error) {
      alert('Error uploading avatar!');
      console.log(error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input type="file"
          id="single"
          accept="image/*"          
          style={{
            width:"100%",
            position: 'absolute',
            visibility:"hidden"
          }}
          onChange={uploadAvatar}
          disabled={uploading}></input>
          <label htmlFor="single">
            
      <Center>

<div ref={ref} >
      <div 
          style={{ height: size, width: size, borderRadius:"10rem",position:"static" }} > 
                <div ref={iconRef} style={{zIndex:10000, position:"absolute", pointerEvents:"none" ,display: hovered || iconHovered ? "block" : "none"}}>
                <Center style={{marginTop:size/2-25, width:size}}>
<IconFileUpload color="white" size={50}/>
      </Center>
      </div>
      <div style={{position:"absolute"}}>
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt="Avatar"
          className="avatar image"
          style={{ height: size, width: size, borderRadius:"10rem", filter: (hovered || iconHovered) ? "blur(3px)" : "initial" }}
        />
      ) : (
        <div className="avatar no-image"  style={{ height: size, width: size }} />
      )}
      </div>
      </div>
      </div>
      </Center>
      </label>

    </div>
  );
}
