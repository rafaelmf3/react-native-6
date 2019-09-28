import React from 'react';
import Main from './Main';
import App from '../../App';
import renderer from 'react-test-renderer';

import * as Apollo from 'apollo-boost';
import * as ApolloHooks from '@apollo/react-hooks';
import ApolloBoost from 'apollo-boost';

const pokemons = [{
  id: "UG9rZW1vbjowMDE=",
  image: "photo",
  name: "Test",
  number: "001",
  types: ["testType", "testType 2"],
}]

jest.mock('apollo-boost');

describe('Main Initial', () => {
  beforeEach(() => {

    Apollo.gql = jest.fn(() => 'gql');
    ApolloHooks.useQuery = jest.fn(() => ({
      loading: true,
      error: false,
      data: {}
    }));
  })

  it('Should initialize the client', () => {
    const instance = renderer.create(<App />).root;

    expect(ApolloBoost).toHaveBeenCalledWith({"uri": "https://graphql-pokemon.now.sh/"});
  })

  it('Should parse the get pokemon query', () => {
    const apolloSpy = jest.spyOn(Apollo, 'gql');

    const instance = renderer.create(<Main />).root;

    expect(apolloSpy).toHaveBeenCalledWith(expect.stringContaining('query pokemons($first: Int!) {'));
    expect(apolloSpy).toHaveBeenCalledWith(expect.stringContaining('pokemons(first: $first) {'));
    expect(apolloSpy).toHaveBeenCalledWith(expect.stringContaining('id'));
    expect(apolloSpy).toHaveBeenCalledWith(expect.stringContaining('number'));
    expect(apolloSpy).toHaveBeenCalledWith(expect.stringContaining('name'));
    expect(apolloSpy).toHaveBeenCalledWith(expect.stringContaining('image'));
    expect(apolloSpy).toHaveBeenCalledWith(expect.stringContaining('types'));
  });

  it('Should get the first 20 pokemons', () => {
    const apolloSpy = jest.spyOn(ApolloHooks, 'useQuery');

    const instance = renderer.create(<Main />).root;

    expect(apolloSpy).toHaveBeenCalledWith('gql', {"variables": {"first": 20}});
  });

  it('Should have a ActivityIndicator when loadin the pokemons', () => {
    const instance = renderer.create(<Main />).root;

    expect(instance.findAllByType('ActivityIndicator').length).toBe(1);
  });

  it('Should have the pokemon image after loading it', () => {
    ApolloHooks.useQuery = jest.fn(() => ({
      loading: false,
      error: false,
      data: {pokemons}
    }));

    const instance = renderer.create(<Main />).root;

    expect(instance.findByProps({ className: 'pokemon-image' }).props.source.uri).toBe('photo');
  });

  it('Should have the pokemon name after loading it', () => {
    ApolloHooks.useQuery = jest.fn(() => ({
      loading: false,
      error: false,
      data: {pokemons}
    }));

    const instance = renderer.create(<Main />).root;
    if (instance.findByProps({ className: 'pokemon-name' }).props.children.join) {
      expect(instance.findByProps({ className: 'pokemon-name' }).props.children.join('')).toBe('001 - Test');
    } else {
      expect(instance.findByProps({ className: 'pokemon-name' }).props.children).toBe('001 - Test');
    }
  });

  it('Should have the pokemon type after loading it', () => {
    ApolloHooks.useQuery = jest.fn(() => ({
      loading: false,
      error: false,
      data: {pokemons}
    }));

    const instance = renderer.create(<Main />).root;
    expect(instance.findAllByProps({ className: 'pokemon-type' })[0].props.children).toBe('testType');
    expect(instance.findAllByProps({ className: 'pokemon-type' })[2].props.children).toBe('testType 2');
  });
});
