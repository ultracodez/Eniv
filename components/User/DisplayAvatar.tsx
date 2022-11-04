export {};

/*import React, { useEffect, useState } from 'react';
import { useSupabaseClient,useUser } from '@supabase/auth-helpers-react';
import { Center, Overlay } from '@mantine/core';
import { useHover } from '@mantine/hooks';
import { IconCamera } from '@supabase/ui';
import { IconFileUpload } from '@tabler/icons';

export default function Avatar({ size }:{size:any}) {


  const supabase = useSupabaseClient();
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const { hovered, ref } = useHover();
  const user = useUser();

  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState(null);
  const [fullname, setFullname] = useState(null);

  async function getProfile() {
    try {
      setLoading(true);

      let { data, error, status } = await supabase
        .from('enivprofiles')
        .select(`username, full_name, avatar_url`).filter('id','eq',user?.id).single();
      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUsername(data.username);
        setFullname(data.full_name);
        setAvatarUrl(data.avatar_url);
      }
    } catch (error) {

      
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (avatarUrl) downloadImage(avatarUrl);
  }, [avatarUrl]);

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

  return (
        <img
          src={avatarUrl}
          alt="Avatar"
          className="avatar image"
          style={{ height: size, width: size, borderRadius:"10rem", filter: (hovered || iconHovered) ? "blur(3px)" : "initial" }}
        />
  );
}
*/
