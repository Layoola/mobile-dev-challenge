import { Stack, useLocalSearchParams } from "expo-router";
import {
  View,
  Text,
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from "react-native";
import { gql, useMutation, useQuery } from "@apollo/client";
import { FavoriteButton } from "../components/FavoritesButton";

const GET_NOODLE_DETAILS = gql`
  query GetNoodleDetails($id: ID!) {
    instantNoodle(where: { id: $id }) {
      id
      name
      brand
      spicinessLevel
      originCountry
      rating
      imageURL
      reviewsCount
      category {
        name
      }
    }
  }
`;

const UPDATE_REVIEWS_COUNT = gql`
  mutation UpdateReviewsCount($id: ID!, $reviewsCount: Int!) {
    updateInstantNoodle(
      where: { id: $id }
      data: { reviewsCount: $reviewsCount }
    ) {
      id
      reviewsCount
    }
  }
`;

export default function NoodlesDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { loading, error, data } = useQuery(GET_NOODLE_DETAILS, {
    variables: { id },
    skip: !id,
  });

  const [updateReviewsCount, { loading: updateLoading }] = useMutation(
    UPDATE_REVIEWS_COUNT,
    {
      optimisticResponse: {
        updateInstantNoodle: {
          id,
          reviewsCount: (data?.instantNoodle?.reviewsCount || 0) + 1,
          __typename: "InstantNoodle",
        },
      },
      update: (cache, { data: mutationData }) => {
        if (mutationData?.updateInstantNoodle) {
          cache.updateQuery(
            {
              query: GET_NOODLE_DETAILS,
              variables: { id },
            },
            (existingData) => {
              if (!existingData?.instantNoodle) return existingData;
              return {
                ...existingData,
                instantNoodle: {
                  ...existingData.instantNoodle,
                  reviewsCount: mutationData.updateInstantNoodle.reviewsCount,
                },
              };
            }
          );
        }
      },
      onError: (error) => {
        Alert.alert("Error", "Failed to submit review. Please try again.");
        console.error("Failed to update reviews count:", error);
      },
    }
  );

  const handleLeaveReview = async () => {
    if (!id) return;

    const currentReviewsCount = data?.instantNoodle?.reviewsCount || 0;
    const newReviewsCount = currentReviewsCount + 1;

    try {
      await updateReviewsCount({
        variables: {
          id,
          reviewsCount: newReviewsCount,
        },
      });
    } catch (error) {}
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error || !data?.instantNoodle) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Failed to load noodle details.</Text>
      </View>
    );
  }

  const noodle = data.instantNoodle;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Stack.Screen options={{ title: noodle.name }} />

      {noodle.imageURL && (
        <Image
          source={{ uri: noodle.imageURL }}
          style={styles.image}
          resizeMode="cover"
        />
      )}

      <Text style={styles.title}>{noodle.name}</Text>
      <Text style={styles.subtitle}>Brand: {noodle.brand}</Text>
      <FavoriteButton noodleId={noodle.id} />
      
      <View style={styles.tags}>
        <Text style={styles.tag}>🌍 {noodle.originCountry}</Text>
        <Text style={styles.tag}>🔥{"🔥".repeat(noodle.spicinessLevel)}</Text>
        <Text style={styles.tag}>⭐ {noodle.rating}/10</Text>
        <Text style={styles.tag}>📦 {noodle.category?.name}</Text>
        <Text style={styles.tag}>📝 {noodle.reviewsCount || 0} reviews</Text>
      </View>
      <TouchableOpacity
        style={[
          styles.reviewButton,
          updateLoading && styles.reviewButtonDisabled,
        ]}
        onPress={handleLeaveReview}
        disabled={updateLoading}
      >
        {updateLoading ? (
          <ActivityIndicator size="small" color="#ffffff" />
        ) : (
          <Text style={styles.reviewButtonText}>Leave Review</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  reviewButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
  },
  reviewButtonDisabled: {
    backgroundColor: "#999",
  },
  reviewButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
  },
  image: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 12,
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 12,
  },
  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tag: {
    backgroundColor: "#ddd",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    marginRight: 8,
    marginBottom: 8,
  },
});