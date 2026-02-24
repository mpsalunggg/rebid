import { AppLayout as AppWrapper } from '@/components/layout/AppLayout'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <AppWrapper>{children}</AppWrapper>
}
