import React, { Component } from 'react';
import api from './services/api';

import {
  StyleSheet,
  Text,
  View,
  Button,
  Alert,
  AsyncStorage,
} from 'react-native';

export default class App extends Component {
  state = {
    loggedInUser: null,
    errorMessage: '',
    projects: [],
  };

  signIn = async () => {
    try {
      const response = await api.post('/auth/authenticate', {
        email: 'diego@rocketseat.com.br',
        password: '123456',
      });

      const { token, user } = response.data;

      await AsyncStorage.multiSet([
        ['@CodeApi:token', token],
        ['@CodeApi:user', JSON.stringify(user)],
      ]);

      this.setState({ loggedInUser: user });

      Alert.alert('Logado com sucesso!');
    } catch (err) {
      this.setState({ errorMessage: err.data.error });
    }
  };

  getProjectList = async () => {
    try {
      const response = await api.get('/projects');

      const { projects } = response.data;

      this.setState({ projects });
    } catch (err) {
      this.setState({ errorMessage: err.data.error });
    }
  };

  async componentDidMount() {
    await AsyncStorage.clear();

    const token = await AsyncStorage.getItem('@CodeApi:token');
    const user = JSON.parse(await AsyncStorage.getItem('@CodeApi:user')) || null;

    if (token && user) 
      this.setState({ loggedInUser: user });
  }

  render() {
    return (
      <View style={styles.container}>
        { !!this.state.errorMessage && <Text>{this.state.errorMessage}</Text> }
        { this.state.loggedInUser
          ? <Button onPress={this.getProjectList} title="Carregar projetos" />
          : <Button onPress={this.signIn} title="Entrar" /> }

        { this.state.projects.map(project => (
          <View key={project._id} style={{ marginTop: 15 }}>
            <Text style={{ fontWeight: 'bold' }}>{project.title}</Text>
            <Text>{project.description}</Text>
          </View>
        ))}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});
