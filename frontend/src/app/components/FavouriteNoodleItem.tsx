import React from "react";
import { useQuery, gql } from "@apollo/client";
import {
  View,
  Text,
  ImageBackground,
  ActivityIndicator,
  Pressable,
  StyleSheet,
} from "react-native";
import { router } from "expo-router";
import { moderateScale, scale } from "react-native-size-matters";
import { Ionicons } from "@expo/vector-icons";
import { useFavorites } from "../context/FavouritesContext";

const GET_NOODLE_DETAILS = gql`
  query GetNoodleDetails($id: ID!) {
    instantNoodle(where: { id: $id }) {
      name
      spicinessLevel
      originCountry
      imageURL
    }
  }
`;

type Props = {
  id: string;
  name: string;
};

export function FavoriteNoodleItem({ id, name }: Props) {
  const { removeFromFavorites } = useFavorites();
  const { loading, data } = useQuery<{ instantNoodle: any }>(
    GET_NOODLE_DETAILS,
    {
      variables: { id },
    }
  );

  const noodle = data?.instantNoodle;

  if (loading)
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator />
      </View>
    );

  if (!noodle) return null;

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.pressable}
        onPress={() => router.push(`/noodle-details/${id}?name=${name}`)}
      >
        {noodle.imageURL && (
          <ImageBackground
            source={{ uri: noodle.imageURL }}
            style={styles.imageBackground}
            resizeMode="cover"
          >
            <View style={styles.overlay}>
              <Text style={styles.spicinessText}>
                {"🔥".repeat(noodle.spicinessLevel)}
              </Text>
              <Text style={styles.nameText}>{noodle.name}</Text>
              <Text
                style={styles.countryText}
              >{`#${noodle.originCountry}`}</Text>
            </View>
          </ImageBackground>
        )}
      </Pressable>

      <Pressable
        style={styles.removeButton}
        onPress={() => removeFromFavorites(id)}
      >
        <Ionicons name="heart" size={24} color="#FF6B6B" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginBottom: scale(8),
    backgroundColor: "white",
    borderRadius: moderateScale(8),
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  loadingContainer: {
    height: 120,
    justifyContent: "center",
    alignItems: "center",
  },
  pressable: {
    flex: 1,
    height: 120,
  },
  imageBackground: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#00000066",
    padding: moderateScale(12),
  },
  spicinessText: {
    fontSize: moderateScale(12),
    color: "white",
    textAlign: "center",
    marginBottom: 4,
  },
  nameText: {
    fontSize: moderateScale(16),
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 4,
  },
  countryText: {
    fontSize: moderateScale(11),
    color: "white",
    textAlign: "center",
  },
  removeButton: {
    width: 60,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
});