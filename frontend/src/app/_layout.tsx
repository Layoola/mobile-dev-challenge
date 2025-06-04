import { ApolloProvider } from "@apollo/client";
import { Stack } from "expo-router";
import client from "@/api/client";
import { FiltersProvider } from "./context/FiltersContext";
import { FavoritesProvider } from "./context/FavoritesContext";

export default function RootLayout() {
  return (
    <ApolloProvider client={client}>
      <FiltersProvider>
        <FavoritesProvider>
          <Stack />
        </FavoritesProvider>
      </FiltersProvider>
    </ApolloProvider>
  )
}
