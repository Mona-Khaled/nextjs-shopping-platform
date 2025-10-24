import { auth } from "@/auth";
import { getOrderById } from "@/lib/actions/order.actions";
import { notFound } from "next/navigation";
import OrderDetailsTable from "./order-details-table";
import { ShippingAddress } from "@/types";

const OrderDetialsPage = async (props: { params: Promise<{ id: string }> }) => {
  const session = await auth();

  const { id } = await props.params;
  const order = await getOrderById(id);
  if (!order) notFound();
  return (
    <OrderDetailsTable
      order={{
        ...order,
        shippingAddress: order.shippingAddress as ShippingAddress,
      }}
      paypalClientId={process.env.PAYPAL_CLIENT_ID || "sb"}
      isAdmin={session?.user.role === "admin" || false}
    />
  );
};

export default OrderDetialsPage;
