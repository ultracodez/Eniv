import { ReactJSXElement } from '@emotion/react/types/jsx-namespace';
import { Menu, Button, Text } from '@mantine/core';
import { IconSettings, IconSearch, IconPhoto, IconMessageCircle, IconTrash, IconArrowsLeftRight, IconCloudUpload } from '@tabler/icons';
import Link from 'next/link';

export default function UserActionMenu({children,...props}:{children:ReactJSXElement[] | ReactJSXElement}) {
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

        <Link href="/auth" passHref>
        <Menu.Item icon={<IconSettings size={14} />} component="a">Settings</Menu.Item>
        </Link>
 
      </Menu.Dropdown>
    </Menu>
  );
}