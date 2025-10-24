import { requireAdmin } from "@/lib/auth-guard";
import { Metadata } from "next";
import ProductForm from "@/components/admin/product-form";
import { notFound } from "next/navigation";
import { getProductById } from "@/lib/actions/product.actions";

export const metadata: Metadata = {
  title: "Update Product",
};

const UpdateProductPage = async (props: {
  params: Promise<{ id: string }>;
}) => {
  await requireAdmin();

  const { id } = await props.params;
  const product = await getProductById(id);

  if (!product) return notFound();

  return (
    <>
      <h2 className="h2-bold">Update Product</h2>
      <div className="my-8">
        <ProductForm type="Update" product={product} productId={product.id} />
      </div>
    </>
  );
};

export default UpdateProductPage;
