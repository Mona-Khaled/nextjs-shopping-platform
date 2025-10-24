"use client";

import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { usePathname } from "next/navigation";

// ** Key Flow **
// Type → Update State → Submit → URL Change → useEffect → Sync State → Rerender

const AdminSearch = () => {
  const pathname = usePathname(); // e.g. /admin/overview
  const formActionUrl = pathname.includes("/admin/orders")
    ? "/admin/orders"
    : pathname.includes("/admin/users")
    ? "/admin/users"
    : "/admin/products";
  const searchParams = useSearchParams();
  const [queryValue, setQueryValue] = useState(searchParams.get("query") || "");

  /**
   * useEffect:
   *  It ensures the input always reflects the current URL state, not just local typing
   *  It's triggered when:
   *  --------------------
   *  - Page load (URL has existing search)
   *  - User navigates back/forward (browser history)
   *  - Another component changes the URL
   *  - Form submission reloads the page
   */

  useEffect(() => {
    setQueryValue(searchParams.get("query") || "");
  }, [searchParams]);

  return (
    <form action={formActionUrl} method="GET">
      <Input
        type="search"
        placeholder="Search..."
        name="query"
        value={queryValue}
        onChange={(e) => setQueryValue(e.target.value)}
        className="md:w-[100px] lg:w-[300px]"
      />

      {/* sr-only will make button only visible to screen readers. 
          So we hit enter to submit the form */}
      <button type="submit" className="sr-only">
        Search
      </button>
    </form>
  );
};

export default AdminSearch;
