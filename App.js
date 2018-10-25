import React, {Component} from 'react';
import { SafeAreaView } from 'react-native';

import Search from './src/screen/Search';

export default class App extends Component{
  render() {
    return (
      <SafeAreaView style={{flex: 1}}>
        <Search />
      </SafeAreaView>
    );
  }
}
