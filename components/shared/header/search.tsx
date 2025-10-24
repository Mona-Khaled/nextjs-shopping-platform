import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAllCategories } from "@/lib/actions/product.actions";
import { SearchIcon } from "lucide-react";

const Search = async () => {
  const categories = await getAllCategories();

  return (
    <form action="/search" method="GET">
      <div className="flex w-full max-w-sm items-center space-x-2">
        <Select name="category">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All" />
          </SelectTrigger>

          {/* key should match the text that is shown */}
          <SelectContent>
            <SelectItem key={"All"} value={"all"}>
              All
            </SelectItem>
            {categories.map((item) => (
              <SelectItem key={item.category} value={item.category}>
                {item.category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* name is q for query */}
        <Input
          name="q"
          type="search"
          placeholder="Search..."
          className="md:w-[100px] lg:w-[300px]"
        />

        <Button>
          <SearchIcon />
        </Button>
      </div>
    </form>
  );
};

export default Search;
