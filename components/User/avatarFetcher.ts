

import { SupabaseClient, useSupabaseClient } from '@supabase/auth-helpers-react';

export default async function avatarFetcher(path:any,supabase:SupabaseClient) {
        try {
          const { data, error } = await supabase.storage.from('avatars').download(path);
          if (error) {
            throw error;
          }
          const url = URL.createObjectURL(data);
          return url;
        } catch (error) {
          console.log('Error downloading image: ', error);
          return null;
        }
      }
    