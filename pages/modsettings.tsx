import { Center, Title } from '@mantine/core';
import { useSession, useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { useEffect, useState } from 'react';

export default function ModSettings() {
  const supabase = useSupabaseClient();
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

  if (role === 'admin') {
    return (
      <div>
        <Center style={{ height: '100vh' }}>
          <Title>There's nothing here yet :{')'}</Title>
        </Center>
      </div>
    );
  } else
    return (
      <>
        <Center style={{ height: '100vh' }}>
          <Title>Access Denied</Title>
        </Center>
      </>
    );
}
