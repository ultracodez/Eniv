import {
  createStyles,
  Image,
  Container,
  Title,
  Text,
  Button,
  SimpleGrid,
  Center,
} from '@mantine/core';
import Link from 'next/link';
import image from '../public/404.svg';

const useStyles = createStyles((theme) => ({
  root: {
    paddingTop: 80,
    paddingBottom: 80,
  },

  title: {
    fontWeight: 900,
    fontSize: 34,
    marginBottom: theme.spacing.md,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,

    [theme.fn.smallerThan('sm')]: {
      fontSize: 32,
    },
  },

  control: {
    [theme.fn.smallerThan('sm')]: {
      width: '100%',
    },
  },

  mobileImage: {
    [theme.fn.largerThan('sm')]: {
      display: 'none',
    },
  },

  desktopImage: {
    [theme.fn.smallerThan('sm')]: {
      display: 'none',
    },
  },
}));

export default function Page404() {
  return (
    <Center style={{ height: 'calc(100vh)' }}>
      <NotFoundImage style={{ marginBottom: '7%' }} />
    </Center>
  );
}

export function NotFoundImage(props: any) {
  const { classes } = useStyles();

  return (
    <Container className={classes.root} {...props}>
      <SimpleGrid spacing={80} cols={2} breakpoints={[{ maxWidth: 'sm', cols: 1, spacing: 40 }]}>
        <Image src={image} className={classes.mobileImage} />
        <div>
          <Title className={classes.title}>Something is not right...</Title>
          <Text color="dimmed" size="lg">
            Page you are trying to open does not exist. You may have mistyped the address, or the
            page has been moved to another URL. If you think this is an error contact support.
          </Text>
          <Link href="/?cameFromNextJSRouting" passHref>
            <Button variant="outline" component="a" size="md" mt="xl" className={classes.control}>
              Get back to home page
            </Button>
          </Link>
        </div>
        <Image src={image.src} className={classes.desktopImage} />
      </SimpleGrid>
    </Container>
  );
}
