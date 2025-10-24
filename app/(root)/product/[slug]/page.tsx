import AddToCart from "@/components/shared/product/add-to-cart";
import ProductImages from "@/components/shared/product/product-images";
import ProductPrice from "@/components/shared/product/product-price";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getProductBySlug } from "@/lib/actions/product.actions";
import { notFound } from "next/navigation";
import { getMyCart } from "@/lib/actions/cart.actions";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Product",
};

const ProductDetailsPage = async (props: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await props.params;

  const product = await getProductBySlug(slug);

  if (!product) {
    notFound(); // send user to not-found page
  }

  const cart = await getMyCart();

  return (
    <section>
      {/* 1 column in small screens ex: mobile screens
          5 columns in medium screens and up */}

      <div className="grid grid-cols-1 md:grid-cols-5">
        {/* Images Column .. span 2 of those 5 columns */}
        <div className="col-span-2">
          <ProductImages images={product.images} />
        </div>

        {/* Details Column  ..  span 2 of those 5 columns */}
        <div className="col-span-2 p-5">
          <div className="flex flex-col gap-6">
            <p>
              {product.brand} {product.category}
            </p>
            <h1 className="h3-bold">{product.name}</h1>
            <p>
              {product.rating} of {product.numReviews} Reviews
            </p>
            {/* <Badge > */}
            <ProductPrice
              value={Number(product.price)}
              className="w-24 rounded-full bg-green-100 text-green-600  px-5 py-2"
            />
            {/* </Badge> */}
          </div>
          <div className="mt-10">
            <p className="font-semibold">Description</p>
            <p>{product.description}</p>
          </div>
        </div>

        {/* Action Column .. take the remaining 1 column*/}
        <div>
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between mb-2">
                <div>Price</div>
                <div>
                  <ProductPrice value={Number(product.price)} />
                </div>
              </div>

              <div className="flex justify-between mb-2">
                <div>Status</div>
                {product.stock > 0 ? (
                  <Badge variant="outline" className="rounded-full">
                    In Stock
                  </Badge>
                ) : (
                  <Badge variant="destructive">Out of Stock</Badge>
                )}
              </div>

              {product.stock > 0 && (
                <div className="flex-center mt-4">
                  {cart && (
                    <AddToCart
                      cart={cart}
                      item={{
                        productId: product.id,
                        name: product.name,
                        slug: product.slug,
                        qty: 1,
                        image: product.images![0],
                        price: product.price,
                      }}
                    />
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ProductDetailsPage;
