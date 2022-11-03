import { Paper } from '@mantine/core';
import { ColorSchemeToggle } from '../ColorSchemeToggle/ColorSchemeToggle';
import Image from 'next/image';
import eniv from '../../public/eniv.svg';

export default function Header() {
  return (
    <Paper radius={'xs'} style={{ position: 'fixed', top: 0, right: 0, left: 0, height: '7%' }}>
      <ColorSchemeToggle style={{ height: '7%', right: 10, position: 'fixed' }} />
      <div style={{ height: '7%', position: 'fixed', width: '10rem', marginLeft: '1rem' }}>
        <Image src={eniv} layout="fill" />
      </div>
    </Paper>
  );
}
