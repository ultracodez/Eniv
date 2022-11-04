import { ReactJSXElement } from '@emotion/react/types/jsx-namespace';
import { Menu, Button, Text, useMantineColorScheme } from '@mantine/core';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { SupabaseClient } from '@supabase/supabase-js';
import { IconSettings, IconSearch, IconPhoto, IconMessageCircle, IconTrash, IconArrowsLeftRight, IconCloudUpload, IconSun, IconMoonStars, IconDoorExit, IconDoorEnter } from '@tabler/icons';
import Link from 'next/link';
import { useState } from 'react';

export default function UserActionMenu({children, loggedIn, supabase,...props}:{children:ReactJSXElement[] | ReactJSXElement, loggedIn:boolean, supabase:SupabaseClient}) {
    const {colorScheme, toggleColorScheme}  =  useMantineColorScheme()
  const [da,setDa] = useState();

  function logInOrOut() {
    setDa(JSON.stringify(loggedIn));
    if(loggedIn) { 
      supabase.auth.signOut();
       document.cookie="";
       localStorage.clear();
       location.reload();
  }
    else window.location.pathname="/auth";
  }


  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        {children}
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>Application</Menu.Label>
        <Link href="/upload" passHref>
        <Menu.Item icon={<IconCloudUpload size={14} />} component="a">Upload</Menu.Item>
        </Link>
        <Menu.Divider />

                   <Menu.Label>Other</Menu.Label>
        <Menu.Item onClick={(e)=>{toggleColorScheme();}} color={colorScheme==="dark" ? "yellow" : "blue"} icon={colorScheme==="dark" ? <IconSun size={14}/> : <IconMoonStars size={14} />}>Switch to {colorScheme === "dark" ? "light" : "dark"}</Menu.Item>
        <Link href="/auth" passHref>
        <Menu.Item icon={<IconSettings size={14} />} component="a">Settings</Menu.Item>
        </Link>

        <Menu.Item color={loggedIn?"red" : null} onClick={logInOrOut} icon={loggedIn ? <IconDoorExit size={14} /> : <IconDoorEnter size={14}/>} component="a">Log {loggedIn ? "Out" : "In"}</Menu.Item>
 
      </Menu.Dropdown>
    </Menu>
  );
}