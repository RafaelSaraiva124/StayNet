import React from "react";
import { FavoritesList } from "@/components/favorite/favoriteList";

const Page = () => {
  return (
    <div className="max-h-1xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Favoritos</h1>
      <FavoritesList />
    </div>
  );
};
export default Page;
