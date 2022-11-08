import { ReactJSXElement } from '@emotion/react/types/jsx-namespace';
import { Menu, Button, Text, useMantineColorScheme } from '@mantine/core';
import { useSession, useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { SupabaseClient } from '@supabase/supabase-js';
import {
  IconSettings,
  IconSearch,
  IconPhoto,
  IconMessageCircle,
  IconTrash,
  IconArrowsLeftRight,
  IconCloudUpload,
  IconSun,
  IconMoonStars,
  IconDoorExit,
  IconDoorEnter,
} from '@tabler/icons';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function UserActionMenu({
  children,
  loggedIn,
  supabase,
  ...props
}: {
  children: ReactJSXElement[] | ReactJSXElement;
  loggedIn: boolean;
  supabase: SupabaseClient;
}) {
  const session = useSession();
  const [role, setRole] = useState<string>();
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
        .select(`username, full_name, avatar_url, role`)
        .filter('id', 'eq', user?.id)
        .single();
      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setRole(data.role);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  function logInOrOut() {
    if (loggedIn) {
      supabase.auth.signOut();
      document.cookie = '';
      localStorage.clear();
      location.reload();
    } else window.location.pathname = '/auth';
  }

  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>{children}</Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>Application</Menu.Label>
        <Link href="/upload?cameFromNextJSRouting" passHref>
          <Menu.Item icon={<IconCloudUpload size={14} />} component="a">
            Upload
          </Menu.Item>
        </Link>
        <Menu.Divider />
        {role === 'admin' ? (
          <>
            <Menu.Label>Moderation</Menu.Label>
            <Menu.Item color="green" icon={<IconSettings size={14} />}>
              Moderation Settings
            </Menu.Item>
            <Menu.Divider />
          </>
        ) : (
          ''
        )}

        <Menu.Label>Other</Menu.Label>
        <Menu.Item
          onClick={(e: any) => {
            toggleColorScheme();
          }}
          color={colorScheme === 'dark' ? 'yellow' : 'blue'}
          icon={colorScheme === 'dark' ? <IconSun size={14} /> : <IconMoonStars size={14} />}
        >
          Switch to {colorScheme === 'dark' ? 'light' : 'dark'}
        </Menu.Item>
        <Link href="/auth" passHref>
          <Menu.Item icon={<IconSettings size={14} />} component="a">
            Settings
          </Menu.Item>
        </Link>
        <Menu.Item
          color={loggedIn ? 'red' : ''}
          onClick={logInOrOut}
          icon={loggedIn ? <IconDoorExit size={14} /> : <IconDoorEnter size={14} />}
          component="a"
        >
          Log {loggedIn ? 'Out' : 'In'}
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
