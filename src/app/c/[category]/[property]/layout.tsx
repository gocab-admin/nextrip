import { Metadata, ResolvingMetadata } from 'next';

import 'bootstrap/scss/bootstrap.scss';

// never use client files in server component....

export async function generateMetadata(_:{
  params: { params: {} }
}, parent: ResolvingMetadata): Promise<Metadata> {
  const parentProps = await(parent) as Metadata
  return {...parentProps, title: `${parentProps?.other?.appname || process.env.NEXT_PUBLIC_APP_NAME}`};
}


export default async function RootLayout({
  children
}: {
  children: React.ReactNode
}) {

  return (
    children
  )
}
