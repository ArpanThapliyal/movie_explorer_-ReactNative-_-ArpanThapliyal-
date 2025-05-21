import React, { useState, useEffect } from 'react';
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
  Dimensions,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation, useRoute } from '@react-navigation/native';
import { launchImageLibrary } from 'react-native-image-picker';
import LinearGradient from 'react-native-linear-gradient';
import { AddMovieRequest, GetMovieById, UpdateMovieRequest } from '../axiosRequest/axiosRequest';
import { useSelector } from 'react-redux';
import { RFValue } from 'react-native-responsive-fontsize';

const { width, height } = Dimensions.get('screen');

const Supervisor = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { movieId, isEditing } = route.params || {};
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
  const [existingPosterUrl, setExistingPosterUrl] = useState(null);
  const [existingBannerUrl, setExistingBannerUrl] = useState(null);

  useEffect(() => {
    if (isEditing && movieId && token) {
      const fetchMovieData = async () => {
        setLoading(true);
        try {
          const data = await GetMovieById(movieId, token);
          if (data) {
            setMovieData({
              title: data.title || '',
              genre: data.genre || '',
              release_year: String(data.release_year) || '',
              rating: String(data.rating) || '',
              director: data.director || '',
              duration: String(data.duration) || '',
              description: data.description || '',
              premium: data.premium || false,
            });
            setExistingPosterUrl(data.poster_url || null);
            setExistingBannerUrl(data.banner_url || null);
          } else {
            Alert.alert('Error', 'Failed to fetch movie data');
          }
        } catch (err) {
          Alert.alert('Error', 'Failed to fetch movie data');
          // console.error('Fetch movie error:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchMovieData();
    }
  }, [isEditing, movieId, token]);

  const handleInputChange = (field, value) => {
    setMovieData({ ...movieData, [field]: value });
  };

  const pickImage = async (type) => {
    const result = await launchImageLibrary({ mediaType: 'photo' });
    if (result.assets?.length) {
      const asset = result.assets[0];
      type === 'poster' ? setPoster(asset) : setBanner(asset);
    }
  };

  const validateMovieData = (data) => {
    const errors = {};
    const currentYear = new Date().getFullYear();

    if (!data.title.trim()) errors.title = '* Title is required';
    if (!data.genre.trim()) errors.genre = '* Genre is required';
    if (!data.release_year.trim()) {
      errors.release_year = '* Release Year is required';
    } else if (!/^\d{4}$/.test(data.release_year)) {
      errors.release_year = ' * Release Year must be a 4-digit number';
    } else {
      const year = parseInt(data.release_year, 10);
      if (year < 1888 || year > currentYear + 10) {
        errors.release_year = `* Release Year must be between 1888 and ${currentYear + 10}`;
      }
    }
    if (!data.rating.trim()) {
      errors.rating = '* Rating is required';
    } else if (!/^\d+(\.\d+)?$/.test(data.rating)) {
      errors.rating = '* Rating must be a number';
    } else {
      const rating = parseFloat(data.rating);
      if (rating < 0 || rating > 10) errors.rating = '* Rating must be between 0 and 10';
    }
    if (!data.director.trim()) errors.director = '* Director is required';
    if (!data.duration.trim()) {
      errors.duration = '* Duration is required';
    } else if (!/^\d+$/.test(data.release_year)) {
      errors.duration = '* Duration must be a positive integer';
    } else {
      const duration = parseInt(data.duration, 10);
      if (duration <= 0) errors.duration = '* Duration must be greater than 0';
    }
    if (!data.description.trim()) errors.description = '* Description is required';
    return errors;
  };

  const handleSubmit = async () => {
    const errors = validateMovieData(movieData);
    const errorMessages = Object.values(errors);

    // if (!isEditing) {
    //   if (!poster) errorMessages.push('* Poster image is required');
    //   if (!banner) errorMessages.push('* Banner image is required');
    // }

    if (errorMessages.length > 0) {
      Alert.alert(`Validation Error`, errorMessages.join(`\n\n`));
      return;
    }

    if (!token) {
      Alert.alert('Auth required', 'Please sign in first.');
      return;
    }

    setLoading(true);
    try {
      const form = new FormData();
      form.append('movie[title]', movieData.title);
      form.append('movie[genre]', movieData.genre);
      form.append('movie[release_year]', movieData.release_year);
      form.append('movie[rating]', movieData.rating);
      form.append('movie[director]', movieData.director);
      form.append('movie[duration]', movieData.duration);
      form.append('movie[description]', movieData.description);
      form.append('movie[premium]', String(movieData.premium));

      if (poster) {
        form.append('movie[poster]', {
          uri: poster.uri,
          type: poster.type || 'image/jpeg',
          name: poster.fileName || 'poster.jpg',
        });
      }
      if (banner) {
        form.append('movie[banner]', {
          uri: banner.uri,
          type: banner.type || 'image/jpeg',
          name: banner.fileName || 'banner.jpg',
        });
      }

      if (isEditing) {
        await UpdateMovieRequest(movieId, form, token);
        Alert.alert('Success', 'Movie updated successfully', [
          { text: 'OK', onPress: () => navigation.replace('MainTabs') },
        ]);
      } else {
        await AddMovieRequest(form, token);
        Alert.alert('Success', 'Movie added successfully', [
          { text: 'OK', onPress: () => navigation.replace('MainTabs') },
        ]);
      }
    } catch (err) {
      console.error('Submit error:', err.response?.data || err);
      Alert.alert('Error', isEditing ? 'Failed to update movie' : 'Failed to add movie');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" backgroundColor="#121212" />
      <LinearGradient
        colors={['rgba(0,123,255,0.3)', 'rgba(18,18,18,0.9)', '#121212']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>{isEditing ? 'Edit Movie' : 'Add New Movie'}</Text>
      </LinearGradient>
      <ScrollView style={styles.form} keyboardShouldPersistTaps="handled">
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
            <Text style={styles.label}>{label} *</Text>
            <LinearGradient
              colors={['rgba(0,123,255,0.1)', 'rgba(25,25,25,0.9)']}
              style={styles.inputContainer}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <TextInput
                style={[styles.input, field === 'description' && styles.textArea]}
                placeholder={label}
                placeholderTextColor="#9CA3AF"
                value={String(movieData[field])}
                onChangeText={(t) => handleInputChange(field, t)}
                keyboardType={
                  ['release_year', 'rating', 'duration'].includes(field)
                    ? 'numeric'
                    : 'default'
                }
                multiline={field === 'description'}
                numberOfLines={field === 'description' ? 4 : 1}
              />
            </LinearGradient>
          </View>
        ))}

        <View style={styles.group}>
          <Text style={styles.label}>Premium</Text>
          <LinearGradient
            colors={['rgba(0,123,255,0.1)', 'rgba(25,25,25,0.9)']}
            style={styles.pickerContainer}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Picker
              selectedValue={movieData.premium}
              onValueChange={(v) => handleInputChange('premium', v)}
              style={styles.picker}
              dropdownIconColor="#9CA3AF"
            >
              <Picker.Item label="No" value={false} />
              <Picker.Item label="Yes" value={true} />
            </Picker>
          </LinearGradient>
        </View>

        <View style={styles.group}>
          <Text style={styles.label}>Poster Image</Text>
          <TouchableOpacity style={styles.imagePicker} onPress={() => pickImage('poster')}>
            <LinearGradient
              colors={['#007BFF', '#0056b3']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientButton}
            >
              <Text style={styles.imagePickerText}>
                {poster ? poster.fileName : 'Choose Poster'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
          {(poster || (isEditing && existingPosterUrl)) && (
            <Image
              source={{ uri: poster ? poster.uri : existingPosterUrl }}
              style={styles.preview}
            />
          )}
        </View>

        <View style={styles.group}>
          <Text style={styles.label}>Banner Image</Text>
          <TouchableOpacity style={styles.imagePicker} onPress={() => pickImage('banner')}>
            <LinearGradient
              colors={['#007BFF', '#0056b3']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientButton}
            >
              <Text style={styles.imagePickerText}>
                {banner ? banner.fileName : 'Choose Banner'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
          {(banner || (isEditing && existingBannerUrl)) && (
            <Image
              source={{ uri: banner ? banner.uri : existingBannerUrl }}
              style={styles.preview}
            />
          )}
        </View>

        <TouchableOpacity style={styles.submit} onPress={handleSubmit} disabled={loading}>
          <LinearGradient
            colors={['#007BFF', '#0056b3']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.submitGradient}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.submitText}>
                {isEditing ? 'Update Movie' : 'Add Movie'}
              </Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? height * 0.06 : height * 0.03,
    paddingBottom: height * 0.03,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: RFValue(24),
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  form: {
    padding: width * 0.04,
  },
  group: {
    marginBottom: height * 0.02,
  },
  label: {
    color: '#FFFFFF',
    fontSize: RFValue(14),
    marginBottom: height * 0.01,
    fontWeight: '600',
  },
  inputContainer: {
    borderRadius: 8,
    borderWidth: 0.4,
    borderColor: '#9CA3AF',
    backgroundColor: '#323539',
  },
  input: {
    color: '#FFFFFF',
    fontSize: RFValue(14),
    paddingHorizontal: width * 0.04,
    height: height * 0.061,
  },
  textArea: {
    height: height * 0.15,
    textAlignVertical: 'top',
    paddingVertical: height * 0.015,
  },
  pickerContainer: {
    borderRadius: 8,
    borderWidth: 0.4,
    borderColor: '#9CA3AF',
    backgroundColor: '#323539',
    overflow: 'hidden',
  },
  picker: {
    color: '#FFFFFF',
    height: height * 0.065,
  },
  imagePicker: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  gradientButton: {
    paddingVertical: height * 0.018,
    alignItems: 'center',
  },
  imagePickerText: {
    color: '#FFFFFF',
    fontSize: RFValue(14),
    fontWeight: 'bold',
  },
  preview: {
    width: width * 0.88,
    height: height * 0.25,
    borderRadius: 8,
    marginTop: height * 0.01,
  },
  submit: {
    borderRadius: 8,
    marginTop: height * 0.035,
    marginBottom: height * 0.1,
    overflow: 'hidden',
  },
  submitGradient: {
    paddingVertical: height * 0.018,
    alignItems: 'center',
  },
  submitText: {
    fontSize: RFValue(16),
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

export default Supervisor;