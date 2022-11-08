//export {};

import React, { useEffect, useState } from 'react';
import { useSession, useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { Avatar, Center, Overlay } from '@mantine/core';
import { useHover } from '@mantine/hooks';
import { IconCamera } from '@supabase/ui';
import { IconFileUpload } from '@tabler/icons';

export default function DisplayAvatar({ size }: { size: any }) {
  const supabase = useSupabaseClient();
  const session = useSession();
  const [avatarUrl, setAvatarUrl] = useState<string>();
  const user = useUser();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProfile();
  }, [session]);

  async function getProfile() {
    try {
      setLoading(true);

      let { data, error, status } = await supabase
        .from('enivprofiles')
        .select(`username, full_name, avatar_url`)
        .filter('id', 'eq', user?.id)
        .single();
      if (error && status !== 406) {
        throw error;
      }

      if (data) {
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

  async function downloadImage(path: string) {
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
    <div>
      {avatarUrl ? (
        <img
          src={avatarUrl ?? ''}
          alt={loading ? 'Loading' : 'Avatar'}
          className="avatar image"
          style={{
            height: size,
            width: size,
            borderRadius: '10rem',
          }}
        />
      ) : (
        <Avatar style={{ width: size, height: size }} radius="xl" />
      )}
    </div>
  );
}
/**/
