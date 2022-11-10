![image](https://user-images.githubusercontent.com/80412399/201219526-c43b7bea-003b-4f63-840e-10555aefc1bc.png)

# Jakerton's Eniv

A clone of the fake app featured in popular youtuber Jakerton's recent livestreams.

Check it out here: https://eniv.vercel.app/

## Purpose

Originally showcased in the livestream [here](https://www.youtube.com/watch?v=E3YhI-0gy4g), the messy and fake version Jakerton created seemed like an interesting idea. I challenged myself to see if I could create a 5-second video sharing platform in under two weeks.


## What it does

"Eniv" is a platform for sharing 5-second videos, complete with an authentication system, moderation system and an upvoting and viewcount system. 

## Dependencies

This project is built on Next.js. The dependencies will be split into four parts: Framework, Frontend, Backend and Deployment

### Framework

`next` - Next.js core package. This is what the application is built on.

`react` and `react-dom` - Next.js peer dependency. This is how the application is built, including JSX and the main orchestration of the app.

`@next/bundle-analyzer` - IDK, it came bundled with the Next.js boilerplate


### Frontend

#### Mantine

`@mantine/core` - Core [Mantine](https://mantine.dev/) components

`@mantine/carousel` - UNUSED - Carousel component for [Mantine](https://mantine.dev/)

`@mantine/dates` - UNUSED - Date picker component for [Mantine](https://mantine.dev/)

`@mantine/dropzone` - Dropzone component for [Mantine](https://mantine.dev/). Used for dropzone styling in the `/upload` route.

`@mantine/form` - Form hooks for [Mantine](https://mantine.dev/). This allows stateful forms and preservation of values.

`@mantine/hooks` - `colorScheme` hooks and others. Used for hover detection in the profile managment page and 

`@mantine/prism` - UNUSED - Code syntax highlighting for [Mantine](https://mantine.dev/)

`@mantine/notifications` - Notification system for [Mantine](https://mantine.dev/). Used to report status to user in multiple plages

`@mantine/modals` - UNUSED - Modal system for [Mantine](https://mantine.dev/).

`@mantine/next` - SSR setup for [Mantine](https://mantine.dev/). Check the [docs](https://mantine.dev/guides/next/).



#### Upload Page



`@ffmpeg-installer/ffmpeg` - UNUSED - originally used during testing phase to see what would work and what wouldn't

`@ffmpeg/core` - Used for video cropping in `/upload` route

`@ffmpeg/ffmpeg` - Used for video cropping in `/upload` route

`shaneffmpeg` - UNUSED

`@cloudinary/react` - Used for client-side uploading in the `/upload` route

`@cloudinary/url-gen` - Used for client-side uploading in the `/upload` route

`@radix-ui/react-scroll-area` - Nice `overflow:scroll` alternative. Used for hiding the scroll bar.

`@stitches/react` - Used for styling of `@radix-ui/react-scroll-area`

`dayjs` - UNUSED - Peer dependency of `@mantine/dates`

`embla-carousel-react` - UNUSED

`graphql` - Used to query video metadata from Hygraph

`graphql-request` - Used to query video metadata from Hygraph

`sanitize-html` - Used to sanitize description, disallowing some hacks

`@types/sanitize-html` - Type definitions for `sanitize-html`

`styled-components` - Used for some styling of non-[Mantine](https://mantine.dev/) components

`cookies-next` - SSR

`@tabler/icons` - Used for icons

`@emotion/react` - Used for [Mantine](https://mantine.dev/) component styling

`@emotion/server` - [Mantine](https://mantine.dev/) component styling



`@supabase/ui` - UNUSED - I tried to use this for the authentication page but it is very poorly made

`@supabase/supabase-js` - Used for authentication, roles, and profiles

`@supabase/auth-ui-react` - Used for authentication

`@supabase/auth-helpers-react` - Used for authentication, roles, and profiles

`@supabase/auth-helpers-nextjs` - Used for authentication, roles, and profiles



### Backend



`cloudinary` - Used in old versions for uploading in `/api/*` routes, non unused. Edge Functions in Vercel have a limit to how much can be uploaded, so 
uploading is now done client-side.

`formidable` - UNUSED - Originally used for reading files from the request

`@types/formidable` - Type definitions for `formidable`



### Deployment



Cloudinary - Used for video storage, fetching and uploads

Hygraph - Used for storing video metadata

Supabase - Used for authentication and profile picture storage

Vercel - Used for deployment



## Building / Deploying

Dev server: `next dev`
Building a static site: `next build`, then go to the newly created directory

Deploying to production: Clone this repo, make a new Vercel project, replace all of the secrets with your API keys to the Deployment dependencies above, and commit to trigger a new Vercel build.

The schema for the Hygraph metadata is so:


![image](https://user-images.githubusercontent.com/80412399/201219355-bd126653-d8a8-4a49-90f7-609036365929.png)






## Some Facts

⏱ *Time it took to make:* 1.8 weeks

IT HAS DARK MODE!!!
