import { AppLayout } from "@/components/layout/app-layout"
import { OrderDetail } from "@/components/orders/order-detail"

export default async function OrdenDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return (
    <AppLayout>
      <OrderDetail orderId={id} />
    </AppLayout>
  )
}
