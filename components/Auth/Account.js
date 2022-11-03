import { useState, useEffect } from 'react';
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react';
import Avatar from '../User/Avatar';
import { Button, Center, Group, TextInput } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { IconCheckCircle, IconX } from '@supabase/ui';
import { IconCheck } from '@tabler/icons';

export default function Account({ session }) {
  const supabase = useSupabaseClient();
  const user = useUser();
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState(null);
  const [website, setWebsite] = useState(null);
  const [avatar_url, setAvatarUrl] = useState(null);

  useEffect(() => {
    getProfile();
  }, [session]);

  async function getProfile() {
    try {
      setLoading(true);

      let { data, error, status } = await supabase
        .from('profiles')
        .select(`username, website, avatar_url`)
        .eq('id', user.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUsername(data.username);
        setWebsite(data.website);
        setAvatarUrl(data.avatar_url);
      }
    } catch (error) {
      alert('Error loading user data!');

      showNotification({
        title: 'Failed to get user data',
        icon: <IconX />,
        color: 'red',
        message: JSON.stringify(error),
      });
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile({ username, website, avatar_url }) {
    try {
      setLoading(true);

      const updates = {
        id: user.id,
        username,
        website,
        avatar_url,
        updated_at: new Date().toISOString(),
      };

      let { error } = await supabase.from('profiles').upsert(updates);
      if (error) throw error;
      showNotification({
        title: 'Updated profile',
        icon: <IconCheck />,
        color: 'green',
        message: ':)',
      });
    } catch (error) {
      showNotification({
        title: 'Failed to updated profile',
        icon: <IconX />,
        color: 'red',
        message: ':,(',
      });
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="form-widget">
      <Avatar
        uid={user.id}
        url={avatar_url}
        size={150}
        onUpload={(url) => {
          setAvatarUrl(url);
          updateProfile({ username, website, avatar_url: url });
        }}
      />
      <div>
        EML
        <TextInput value={session.user.email} disabled></TextInput>
      </div>
      <div>
        <label htmlFor="username">Username</label>
        <TextInput
          id="username"
          value={username || ''}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="website">Website</label>
        <TextInput
          id="website"
          type="website"
          value={website || ''}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>

      <br />
      <Center>
        <Group>
          <Button
            color="indigo"
            variant={loading ? 'outline' : 'filled'}
            className="button primary block"
            onClick={() => updateProfile({ username, website, avatar_url })}
            disabled={loading}
          >
            {loading ? 'Loading ...' : 'Update'}
          </Button>
          <Button
            variant="outline"
            color="indigo"
            className="button block"
            onClick={() => supabase.auth.signOut()}
          >
            Sign Out
          </Button>
        </Group>
      </Center>
    </div>
  );
}
