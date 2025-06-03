import { ApolloProvider } from "@apollo/client";
import { Stack } from "expo-router";
import client from "@/api/client";
import { FavoritesProvider } from "./context/FavoritesContext";
import {FiltersProvider} from "@/app/context/FiltersContext";

export default function RootLayout() {
  return (
    <ApolloProvider client={client}>
      <FiltersProvider>
        <FavoritesProvider>
          <Stack />
        </FavoritesProvider>
      </FiltersProvider>
    </ApolloProvider>
  );
}