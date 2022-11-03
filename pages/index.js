import { Auth, ThemeSupa } from '@supabase/auth-ui-react';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { Container, useMantineColorScheme } from '@mantine/core';
import Account from '../components/Auth/Account';

const Home = () => {
  const session = useSession();
  const supabase = useSupabaseClient();

  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  const csTheme = colorScheme ?? 'light';

  return (
    <Container style={{ paddingTop: '25vh' }} size="xs">
      <div>
        {!session ? (
          <Auth
            providers={['github']}
            supabaseClient={supabase}
            appearance={{ theme: ThemeSupa }}
            theme={csTheme === 'dark' ? 'dark' : 'default'}
          />
        ) : (
          <Account session={session} />
        )}
      </div>
    </Container>
  );
};

export default Home;
