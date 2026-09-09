import { closeOrder, updateOrder } from "@/lib/api/orders"
import { getOrderSession } from "@/lib/order-storage"
import type { UpdateOrderPayload } from "@/lib/api/orders"

export async function tryUpdateOrder(payload: UpdateOrderPayload) {
  const session = getOrderSession()
  if (!session) {
    return null
  }

  return updateOrder(session.orderId, session.orderToken, payload)
}

export async function tryCloseOrder() {
  const session = getOrderSession()
  if (!session) {
    return null
  }

  return closeOrder(session.orderId, session.orderToken)
}
