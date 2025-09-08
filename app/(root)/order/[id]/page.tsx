import { getOrderById } from "@/lib/actions/order.actions";
import { notFound } from "next/navigation";

const OrderDetialsPage = async (props: { params: Promise<{ id: string }> }) => {
  const { id } = await props.params;
  const order = await getOrderById(id);
  if (!order) notFound();
  return <></>;
};

export default OrderDetialsPage;
