// AddMovie.js
import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  Platform,
  StatusBar,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  TouchableOpacity,
  Image,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {useNavigation} from '@react-navigation/native';
import {launchImageLibrary} from 'react-native-image-picker';
import {AddMovieRequest} from '../axiosRequest/axiosRequest';
import {useSelector} from 'react-redux';

const AddMovie = () => {
  const navigation = useNavigation();
  const token = useSelector(state => state.user.token);
  const [loading, setLoading] = useState(false);
  const [movieData, setMovieData] = useState({
    title: '',
    genre: '',
    release_year: '',
    rating: '',
    director: '',
    duration: '',
    description: '',
    premium: false,
  });
  const [poster, setPoster] = useState(null);
  const [banner, setBanner] = useState(null);

  const handleInputChange = (field, value) => {
    setMovieData({...movieData, [field]: value});
  };

  const pickImage = async type => {
    const result = await launchImageLibrary({mediaType: 'photo'});
    if (result.assets?.length) {
      const asset = result.assets[0];
      type === 'poster' ? setPoster(asset) : setBanner(asset);
    }
  };

  const handleAddMovie = async () => {
    // 1. Validate
    const required = [
      'title',
      'genre',
      'release_year',
      'rating',
      'director',
      'duration',
      'description',
    ];
    const missing = required.filter(f => !movieData[f]);
    if (missing.length || !poster || !banner) {
      Alert.alert(
        'Missing fields',
        [...missing, !poster && 'poster', !banner && 'banner']
          .filter(Boolean)
          .join(', '),
      );
      return;
    }

    if (!token) {
      Alert.alert('Auth required', 'Please sign in first.');
      return;
    }

    setLoading(true);
    try {
      // 2. Build FormData with movie[...] keys
      const form = new FormData();
      form.append('movie[title]', movieData.title);
      form.append('movie[genre]', movieData.genre);
      form.append('movie[release_year]', movieData.release_year);
      form.append('movie[rating]', movieData.rating);
      form.append('movie[director]', movieData.director);
      form.append('movie[duration]', movieData.duration);
      form.append('movie[description]', movieData.description);
      form.append('movie[premium]', String(movieData.premium));

      form.append('movie[poster]', {
        uri: poster.uri,
        type: poster.type || 'image/jpeg',
        name: poster.fileName || 'poster.jpg',
      });
      form.append('movie[banner]', {
        uri: banner.uri,
        type: banner.type || 'image/jpeg',
        name: banner.fileName || 'banner.jpg',
      });

      // 3. Send to backend
      await AddMovieRequest(form, token);

      Alert.alert('Success', 'Movie added', [
        {text: 'OK', onPress: () => navigation.goBack()},
      ]);
    } catch (err) {
      console.error('AddMovie error:', err.response?.data || err);
      Alert.alert('Error', 'Failed to add movie');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0A1A" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Add New Movie</Text>
      </View>
      <ScrollView style={styles.form}>
        {Object.entries({
          Title: 'title',
          Genre: 'genre',
          'Release Year': 'release_year',
          Rating: 'rating',
          Director: 'director',
          'Duration (mins)': 'duration',
          Description: 'description',
        }).map(([label, field]) => (
          <View key={field} style={styles.group}>
            <Text style={styles.label}>{label}</Text>
            <TextInput
              style={[styles.input, field === 'description' && styles.textArea]}
              placeholder={label}
              placeholderTextColor="#8B8B9E"
              value={String(movieData[field])}
              onChangeText={t => handleInputChange(field, t)}
              keyboardType={
                ['release_year', 'rating', 'duration'].includes(field)
                  ? 'numeric'
                  : 'default'
              }
              multiline={field === 'description'}
              numberOfLines={field === 'description' ? 4 : 1}
            />
          </View>
        ))}

        <View style={styles.group}>
          <Text style={styles.label}>Premium</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={movieData.premium}
              onValueChange={v => handleInputChange('premium', v)}
              dropdownIconColor="#FFF">
              <Picker.Item label="False" value={false} />
              <Picker.Item label="True" value={true} />
            </Picker>
          </View>
        </View>

        <View style={styles.group}>
          <Text style={styles.label}>Poster Image</Text>
          <TouchableOpacity
            style={styles.imagePicker}
            onPress={() => pickImage('poster')}>
            <Text style={styles.imagePickerText}>
              {poster?.fileName || 'Choose Poster'}
            </Text>
          </TouchableOpacity>
          {poster && (
            <Image source={{uri: poster.uri}} style={styles.preview} />
          )}
        </View>

        <View style={styles.group}>
          <Text style={styles.label}>Banner Image</Text>
          <TouchableOpacity
            style={styles.imagePicker}
            onPress={() => pickImage('banner')}>
            <Text style={styles.imagePickerText}>
              {banner?.fileName || 'Choose Banner'}
            </Text>
          </TouchableOpacity>
          {banner && (
            <Image source={{uri: banner.uri}} style={styles.preview} />
          )}
        </View>

        <TouchableOpacity
          style={styles.submit}
          onPress={handleAddMovie}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text style={styles.submitText}>Add Movie</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#0A0A1A'},
  header: {
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 20,
    backgroundColor: '#0A0A1A',
    borderBottomWidth: 2,
    borderBottomColor: '#FFDD00',
    alignItems: 'center',
  },
  headerTitle: {fontSize: 24, fontWeight: 'bold', color: '#FFDD00'},
  form: {padding: 16},
  group: {marginBottom: 16},
  label: {color: '#FFF', fontSize: 16, marginBottom: 8, fontWeight: '600'},
  input: {
    backgroundColor: '#1C1C3E',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3E3E70',
    padding: 12,
    color: '#FFF',
    fontSize: 16,
  },
  textArea: {height: 100, textAlignVertical: 'top'},
  pickerContainer: {
    backgroundColor: '#1C1C3E',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3E3E70',
    overflow: 'hidden',
  },
  imagePicker: {
    backgroundColor: '#FFDD00',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  imagePickerText: {color: '#000', fontWeight: 'bold'},
  preview: {width: '100%', height: 200, borderRadius: 8, marginTop: 8},
  submit: {
    backgroundColor: '#FFDD00',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  submitText: {fontSize: 18, fontWeight: 'bold', color: '#000'},
});

export default AddMovie;
