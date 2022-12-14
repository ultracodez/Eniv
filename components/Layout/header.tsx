import { Avatar, Button, Center, Divider, Paper, useMantineColorScheme } from '@mantine/core';
import { ColorSchemeToggle } from '../ColorSchemeToggle/ColorSchemeToggle';
import Image from 'next/image';
import eniv from '../../public/eniv.png';
import Link from 'next/link';
import { AuthSession } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import { useSession, useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { getProfile } from '../Auth/getProfile';
import avatarFetcher from '../User/avatarFetcher';
import DisplayAvatar from '../User/DisplayAvatar';

import UserActionMenu from '../User/Menu';

export default function Header({
  oldSession,
  ...props
}: {
  oldSession?: AuthSession;
  extraProps: any;
}) {
  const { colorScheme } = useMantineColorScheme();
  const session = useSession();
  const supabase = useSupabaseClient();

  const user = useUser();

  const [debugMessages, setDebugMessages] = useState<string>('');
  const [avatarUrl, setAvatarUrl] = useState<undefined | null | string>();
  const [userProfile, setUserProfile] = useState<any>();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (JSON.stringify((avatarUrl ?? false) && (session?.user?.id ?? false))) {
      // /fetcher();
    }
  });

  const fetcher = async () => {
    setLoading(true);
    setUserProfile(await getProfile(user?.id, supabase));

    setLoading(false);
    setAvatarUrl(await avatarFetcher(userProfile?.avatar_url, supabase));
  };

  useEffect(() => {
    fetcher();
  }, [session]);

  return (
    <Paper
      radius={'xs'}
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        left: 0,
        height: '5rem',
        zIndex: 9999,
        backgroundColor: '#01b686',
      }}
    >
      <Center style={{ height: '5rem', right: 10, position: 'fixed' }}>
        {debugMessages}
        {true ? (
          <UserActionMenu supabase={supabase} loggedIn={session?.user.id ? true : false}>
            {/*<img
              style={{
                objectFit: 'cover',
                borderRadius: '10rem',
                width: '3.5rem',
                height: '3.5rem',
                marginRight: '5rem',
              }}
              src={avatarUrl ?? ''}
            />*/}
            <div style={{ marginRight: '5rem' }}>
              <DisplayAvatar size={'3.5rem'} />
            </div>
          </UserActionMenu>
        ) : (
          <UserActionMenu supabase={supabase} loggedIn={session?.user.id ? true : false}>
            <Avatar
              style={{ width: '3.5rem', height: '3.5rem', marginRight: '5rem' }}
              radius="xl"
            />
          </UserActionMenu>
        )}
      </Center>
      <Link href="/?cameFromNextJSRouting" passHref>
        <a>
          <div style={{ height: '5rem', position: 'fixed', width: '10rem', marginLeft: '5rem' }}>
            <Image src={eniv} layout="fill" />
          </div>
        </a>
      </Link>
      {/* Padding */}
      <div style={{ height: '84%' }}></div>
    </Paper>
  );
}
