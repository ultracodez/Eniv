import { ReactJSXElement } from '@emotion/react/types/jsx-namespace';
import { Menu, Button, Text, useMantineColorScheme } from '@mantine/core';
import { IconSettings, IconSearch, IconPhoto, IconMessageCircle, IconTrash, IconArrowsLeftRight, IconCloudUpload, IconSun, IconMoonStars } from '@tabler/icons';
import Link from 'next/link';

export default function UserActionMenu({children,...props}:{children:ReactJSXElement[] | ReactJSXElement}) {
    const {colorScheme, toggleColorScheme}  =  useMantineColorScheme()
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
 
      </Menu.Dropdown>
    </Menu>
  );
}