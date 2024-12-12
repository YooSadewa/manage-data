'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ReactNode } from 'react';

interface ActiveLinkProps {
  href: string;
  children: ReactNode;
  additionalClass?: string;
}

export default function ActiveLink({
  href,
  children,
  additionalClass = '', 
}: ActiveLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`${additionalClass} ${isActive ? 'bg-[#293854] text-white' : ''}`}
    >
      {children}
    </Link>
  );
}
