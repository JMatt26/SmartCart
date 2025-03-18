import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, FlatList, Pressable, Image, ActivityIndicator } from "react-native";
import { HouseholdContext } from "../context/HouseholdContext";
import { BackButton } from "../components/BackButton";
import { RequestedItemCard } from "../components/RequestedItemCard";
import { collection, onSnapshot, query } from "firebase/firestore";
import { firestore, spoonacularAPIKey } from "../firebase/config";
import { useNavigation } from "@react-navigation/native";
import { AddButton } from "../components/AddButton";
import { SearchButton } from "../components/SearchButton";
import { FindRecipesButton } from "../components/FindRecipesButton";
import axios from "axios";

export const RecipeSuggestions = ({ route }) => {
  const { shoppingListName, shoppingListId, shoppingListCategory, shoppingListItems } = route.params;
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      let shoppingListItemNames = [];
      for (let i = 0; i < shoppingListItems.length; i++) {
        shoppingListItemNames.push(shoppingListItems[i].name);
      }
      const ingredients = shoppingListItemNames.join(',+');
      const response = await fetch(
        `https://api.spoonacular.com/recipes/findByIngredients?apiKey=${spoonacularAPIKey}&ingredients=${ingredients}&number=10`
      );
      const data = await response.json();
      setRecipes(data);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderRecipeCard = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.subtitle}>Used Ingredients:</Text>
      {item.usedIngredients.map((ingredient, index) => (
        <Text key={index} style={styles.usedIngredient}>
          {ingredient.original}
        </Text>
      ))}
      <Text style={styles.subtitle}>Missing Ingredients:</Text>
      {item.missedIngredients.map((ingredient, index) => (
        <Text key={index} style={styles.missingIngredient}>
          {ingredient.original}
        </Text>
      ))}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <FlatList
      data={recipes}
      renderItem={renderRecipeCard}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.list}
    />
  );
};

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
  },
  usedIngredient: {
    fontSize: 14,
    color: 'green',
  },
  missingIngredient: {
    fontSize: 14,
    color: 'red',
  },
});
