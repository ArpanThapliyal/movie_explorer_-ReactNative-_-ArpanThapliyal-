import React from 'react';
import { Text ,StyleSheet,View} from 'react-native';
import Navigation from './src/navigation/Navigation';
import { Provider } from 'react-redux';
import myStore from './src/redux/store/MyStore';
const App = () =>{
  return (
    <Provider store={myStore}>
      <View style={styles.container}>
        <Navigation/>
      </View>
    </Provider>
  )
}

const styles = StyleSheet.create({
  container:{
    flex:1,
  }
})
export default App;
