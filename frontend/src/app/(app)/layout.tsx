import { AppLayout as AppWrapper } from '@/components/layout/AppLayout'
import AppDialog from '@/components/common/AppDialog'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppWrapper>
      {children}
      <AppDialog />
    </AppWrapper>
  )
}
