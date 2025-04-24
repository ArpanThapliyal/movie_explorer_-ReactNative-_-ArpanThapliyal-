import React from 'react';
import { Text ,StyleSheet,View} from 'react-native';
import Navigation from './src/navigation/navigation';
const App = () =>{
  return (
    <View style={styles.container}>
      <Navigation/>
    </View>
  )
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    
  }
})
export default App;
