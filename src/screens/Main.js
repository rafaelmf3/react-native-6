import React, { PureComponent } from 'react';
import {StyleSheet, ScrollView, Text, Image, ActivityIndicator} from 'react-native';

import { useQuery, ApolloProvider } from '@apollo/react-hooks';
import ApolloClient, { gql } from "apollo-boost";


export default function Main() {
  const load = true;
  const client = new ApolloClient({
    uri: "https://graphql-pokemon.now.sh/"
  });
  
  const pokemon = gql( 
    `query pokemons($first: Int!) {
    pokemons(first: $first) {
      id
      number
      name
      image
      types
    }}`
  
    
      
  );
  
  const {loading, error, data} = useQuery(pokemon, {
    variables: {first: 20}
  });

  // if (loading) return <p>Loading...</p>;
  // if (error) return <p>Error :(</p>;

  return (<>
    <ScrollView style={styles.container}>
      { loading 
        ? <ActivityIndicator></ActivityIndicator>
        : <>
            <Image className="pokemon-image" source={{uri: 'photo'}}/>
            <Text className="pokemon-name">001 - Test</Text>
            <Text className="pokemon-type">testType</Text>
            <Text>HELLO</Text>
            <Text className="pokemon-type">testType 2</Text>
          </>
      }
    </ScrollView>
        </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  }
});



