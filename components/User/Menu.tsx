import { ReactJSXElement } from '@emotion/react/types/jsx-namespace';
import { Menu, Button, Text } from '@mantine/core';
import { IconSettings, IconSearch, IconPhoto, IconMessageCircle, IconTrash, IconArrowsLeftRight, IconCloudUpload } from '@tabler/icons';

export default function UserActionMenu({children,...props}:{children:ReactJSXElement[] | ReactJSXElement}) {
  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        {children}
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>Application</Menu.Label>
        <Menu.Item icon={<IconCloudUpload size={14} />}>Upload</Menu.Item>

        <Menu.Divider />

        <Menu.Label>Other</Menu.Label>
        <Menu.Item icon={<IconSettings size={14} />}>Settings</Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}