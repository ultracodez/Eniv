import { Divider, Paper } from '@mantine/core';
import { ColorSchemeToggle } from '../ColorSchemeToggle/ColorSchemeToggle';
import Image from 'next/image';
import eniv from '../../public/eniv.svg';
import Link from 'next/link';
import { AuthSession } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { getProfile } from '../Auth/getProfile';
import avatarFetcher from '../User/avatarFetcher';

export default function Header({session}:{session:AuthSession}) {

  const supabase = useSupabaseClient();

  const user = useUser();

  const [avatarUrl,setAvatarUrl] = useState();
  const [userProfile, setUserProfile] = useState();

  useEffect(()=>{

  },[userProfile])

  async function setAvatar(userProfile:any) {
    setAvatarUrl("a"+await avatarFetcher(url.avatar_url,supabase))
  }

  useEffect(() => {
    const fetcher = async () => {
      
    await getProfile(user?.id,supabase,setUserProfile);
    
  };
    fetcher()
  }, [session]);

  return (
    <Paper radius={'xs'} style={{ position: 'fixed', top: 0, right: 0, left: 0, height: '7%' }}>
      {JSON.stringify(userProfile)}
      <div style={{ height: '7%', right: 10, position: 'fixed' }} >{avatarUrl}?</div>
      <Link href="/" passHref>
        <a >
      <div style={{ height: '7%', position: 'fixed', width: '10rem', marginLeft: '1rem' }}>
        <Image src={eniv} layout="fill" />
      </div>
      </a>
      </Link>
      {/* Padding */}
      <div style={{height:"90%"}}></div>
      <Divider my="sm" variant="dashed"/>
    </Paper>
  );
}
