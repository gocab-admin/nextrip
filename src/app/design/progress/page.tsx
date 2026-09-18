'use client'
import { usePathname, redirect } from 'next/navigation';

export default function Progress() {
    const pathname: any = usePathname()

    if (pathname.endsWith('progress')) {
        redirect('/progress/opportunity-hub')
    }
    return null
}
