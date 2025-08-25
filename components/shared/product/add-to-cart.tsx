"use client";

import { Button } from "@/components/ui/button";
import { Cart, CartItem } from "@/types";
import { useRouter } from "next/navigation";
import { Plus, Minus, Loader } from "lucide-react";
// a hook to initialize the toast function that we can use to create a toast
import { useToast } from "@/hooks/use-toast";
// allow us to customize and add things like buttons to the toast
import { ToastAction } from "@/components/ui/toast";
import { addItemToCart, removeItemFromCart } from "@/lib/actions/cart.actions";
import { useTransition } from "react";

const AddToCart = ({ cart, item }: { cart: Cart; item: CartItem }) => {
  const router = useRouter();
  // get the toast function from the hook
  const { toast } = useToast();
  /**
    => isPending: A boolean value that indicates whether the transition is still ongoing. 
       This can be used to show a loading spinner or other feedback to the user.
    => startTransition: A function that you wrap around any state updates that you want to handle as a transition. 
       It tells React to delay marking this update as urgent, giving priority to other interactive UI updates.  */
  const [isPending, startTransition] = useTransition();

  const handleAddToCart = async () => {
    startTransition(async () => {
      // Execute the addItemToCart action
      const res = await addItemToCart(item);

      // Display appropriate toast message based on the result
      if (!res.success) {
        toast({
          variant: "destructive",
          description: res.message,
        });
        return;
      }
      // Handle success
      toast({
        description: res.message,
        action: (
          <ToastAction
            className="text-white bg-primary hover:bg-gray-800"
            altText="Go To Cart"
            onClick={() => router.push("/cart")}
          >
            Go To Cart
          </ToastAction>
        ),
      });
    });
  };

  const handleRemoveFromCart = async () => {
    startTransition(async () => {
      const res = await removeItemFromCart(item.productId);

      toast({
        variant: res.success ? "default" : "destructive",
        description: res.message,
      });

      return;
    });
  };

  // boolean to control button layout
  const existItem =
    cart && cart.items.find((x) => x.productId === item.productId);

  return existItem ? (
    <div>
      <Button
        type="button"
        variant="outline"
        disabled={isPending}
        onClick={handleRemoveFromCart}
      >
        {isPending ? (
          <Loader className="w-4 h-4  animate-spin" />
        ) : (
          <Minus className="w-4 h-4" />
        )}
      </Button>

      <span className="px-2">{existItem.qty}</span>

      <Button
        type="button"
        variant="outline"
        disabled={isPending}
        onClick={handleAddToCart}
      >
        {isPending ? (
          <Loader className="w-4 h-4 animate-spin" />
        ) : (
          <Plus className="w-4 h-4" />
        )}
      </Button>
    </div>
  ) : (
    <Button className="w-full" type="button" onClick={handleAddToCart}>
      {isPending ? (
        <Loader className="w-4 h-4 animate-spin" />
      ) : (
        <Plus className="w-4 h-4" />
      )}
      Add to cart
    </Button>
  );
};

export default AddToCart;
