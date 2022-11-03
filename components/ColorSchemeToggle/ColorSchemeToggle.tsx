import { ActionIcon, Group, useMantineColorScheme } from '@mantine/core';
import { IconSun, IconMoonStars } from '@tabler/icons';

export function ColorSchemeToggle(props: any) {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  return (
    <Group {...props}>
      <ActionIcon
        onClick={() => toggleColorScheme()}
        size="xl"
        radius={'sm'}
        variant="light"
        color={colorScheme === 'dark' ? 'yellow' : 'indigo'}
        sx={(theme) => ({
          color: theme.colorScheme === 'dark' ? theme.colors.yellow[4] : theme.colors.blue[6],
        })}
      >
        {colorScheme === 'dark' ? (
          <IconSun size={20} stroke={1.5} />
        ) : (
          <IconMoonStars size={20} stroke={1.5} />
        )}
      </ActionIcon>
    </Group>
  );
}
