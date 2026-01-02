import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Platform, Image, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { AppContextType } from '../../types';
import { Ionicons } from '@expo/vector-icons';

const categories = ['Electrician', 'Plumber', 'Carpenter', 'Painter', 'AC Technician', 'Cleaner', 'Other'];

export function PostTask({ context }: { context: AppContextType }) {
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [budget, setBudget] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [attachedVideo, setAttachedVideo] = useState<string | null>(null);

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera roll permissions');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setAttachedImage(result.assets[0].uri);
      setAttachedVideo(null);
    }
  };

  const handlePickVideo = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera roll permissions');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setAttachedVideo(result.assets[0].uri);
      setAttachedImage(null);
    }
  };

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatTime = (date: Date) => {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const handleSubmit = () => {
    const newTask = {
      id: `task-${Date.now()}`,
      title,
      description,
      category,
      location,
      budget: parseFloat(budget),
      date: formatDate(selectedDate),
      time: formatTime(selectedTime),
      image: attachedImage || attachedVideo || undefined,
      status: 'pending' as const,
      customerId: context.currentUser?.id || 'customer-1',
      customerName: context.currentUser?.name || 'Ahmed',
      bids: [
        {
          id: 'bid-1',
          workerId: 'worker-1',
          workerName: 'Ali Khan',
          workerPhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ali',
          skill: category,
          bidPrice: parseFloat(budget) * 0.8,
          rating: 4.8,
          distance: '2.5 km',
          verified: true,
          completionTime: '2 hours',
        },
        {
          id: 'bid-2',
          workerId: 'worker-2',
          workerName: 'Bilal Ahmed',
          workerPhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bilal',
          skill: category,
          bidPrice: parseFloat(budget) * 0.9,
          rating: 4.5,
          distance: '3.8 km',
          verified: true,
          completionTime: '3 hours',
        },
        {
          id: 'bid-3',
          workerId: 'worker-3',
          workerName: 'Kamran Hussain',
          workerPhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kamran',
          skill: category,
          bidPrice: parseFloat(budget),
          rating: 4.9,
          distance: '1.2 km',
          verified: true,
          completionTime: '1.5 hours',
        },
      ],
    };

    context.setCurrentTask(newTask);
    context.setTasks([...context.tasks, newTask]);
    context.setScreen('bidding');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => context.setScreen('customer-dashboard')}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Post a Task</Text>
        </View>

        {/* Step Indicator */}
        <View style={styles.stepIndicator}>
          {[1, 2, 3].map((s) => (
            <View key={s} style={styles.stepBarContainer}>
              <View
                style={[
                  styles.stepBar,
                  s <= step && styles.stepBarActive,
                ]}
              />
            </View>
          ))}
        </View>
        <View style={styles.stepLabels}>
          <Text style={styles.stepLabel}>Details</Text>
          <Text style={styles.stepLabel}>Location</Text>
          <Text style={styles.stepLabel}>Budget</Text>
        </View>
      </View>

      {/* Form */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.formContainer} bounces={false} scrollEventThrottle={16}>
        {step === 1 && (
          <View style={styles.stepContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Task Title</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Fix Kitchen Sink"
                value={title}
                onChangeText={setTitle}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Category</Text>
              <View style={styles.selectContainer}>
                <Picker
                  selectedValue={category}
                  onValueChange={setCategory}
                  style={styles.picker}
                >
                  <Picker.Item label="Select a category" value="" />
                  {categories.map((cat) => (
                    <Picker.Item key={cat} label={cat} value={cat} />
                  ))}
                </Picker>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Describe the task in detail..."
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Upload Image/Video (Optional)</Text>
              {attachedImage ? (
                <View style={styles.attachedMediaContainer}>
                  <Image source={{ uri: attachedImage }} style={styles.attachedImage} />
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => setAttachedImage(null)}
                  >
                    <Ionicons name="close-circle" size={24} color="#c00" />
                  </TouchableOpacity>
                </View>
              ) : attachedVideo ? (
                <View style={styles.attachedMediaContainer}>
                  <View style={styles.videoPreview}>
                    <Ionicons name="videocam" size={48} color="#999" />
                    <Text style={styles.videoPreviewText}>Video Selected</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => setAttachedVideo(null)}
                  >
                    <Ionicons name="close-circle" size={24} color="#c00" />
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.uploadOptions}>
                  <TouchableOpacity style={styles.uploadArea} onPress={handlePickImage}>
                    <Ionicons name="image-outline" size={32} color="#999" />
                    <Text style={styles.uploadText}>Photo</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.uploadArea} onPress={handlePickVideo}>
                    <Ionicons name="videocam-outline" size={32} color="#999" />
                    <Text style={styles.uploadText}>Video</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            <TouchableOpacity
              style={[
                styles.button,
                (!title || !category || !description) && styles.buttonDisabled,
              ]}
              onPress={() => setStep(2)}
              disabled={!title || !category || !description}
            >
              <Text style={styles.buttonText}>Next: Location</Text>
            </TouchableOpacity>
          </View>
        )}

        {step === 2 && (
          <View style={styles.stepContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Location</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="location-outline" size={16} color="#999" style={styles.inputIcon} />
                <TextInput
                  style={styles.inputWithIcon}
                  placeholder="Enter your address"
                  value={location}
                  onChangeText={setLocation}
                />
              </View>
            </View>

            {/* Map Placeholder */}
            <View style={styles.mapPlaceholder}>
              <Ionicons name="location" size={48} color="#999" />
              <Text style={styles.mapPlaceholderText}>Map View</Text>
              <Text style={styles.mapPlaceholderSubtext}>Pin your location</Text>
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.button, styles.buttonSecondary]}
                onPress={() => setStep(1)}
              >
                <Text style={[styles.buttonText, styles.buttonTextSecondary]}>Back</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, (!location) && styles.buttonDisabled]}
                onPress={() => setStep(3)}
                disabled={!location}
              >
                <Text style={styles.buttonText}>Next: Budget</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {step === 3 && (
          <View style={styles.stepContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Your Budget (PKR)</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="cash-outline" size={16} color="#999" style={styles.inputIcon} />
                <TextInput
                  style={styles.inputWithIcon}
                  placeholder="Enter your budget"
                  value={budget}
                  onChangeText={setBudget}
                  keyboardType="numeric"
                />
              </View>
              <Text style={styles.hint}>Suggested: PKR 2,000 - 5,000</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Preferred Date</Text>
              <TouchableOpacity
                style={styles.inputWrapper}
                onPress={() => setShowDatePicker(true)}
              >
                <Ionicons name="calendar-outline" size={16} color="#999" style={styles.inputIcon} />
                <Text style={styles.dateTimeText}>
                  {formatDate(selectedDate)}
                </Text>
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={selectedDate}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={(event, date) => {
                    setShowDatePicker(Platform.OS === 'ios');
                    if (date) setSelectedDate(date);
                  }}
                  minimumDate={new Date()}
                />
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Preferred Time</Text>
              <TouchableOpacity
                style={styles.inputWrapper}
                onPress={() => setShowTimePicker(true)}
              >
                <Ionicons name="time-outline" size={16} color="#999" style={styles.inputIcon} />
                <Text style={styles.dateTimeText}>
                  {formatTime(selectedTime)}
                </Text>
              </TouchableOpacity>
              {showTimePicker && (
                <DateTimePicker
                  value={selectedTime}
                  mode="time"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={(event, time) => {
                    setShowTimePicker(Platform.OS === 'ios');
                    if (time) setSelectedTime(time);
                  }}
                />
              )}
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.button, styles.buttonSecondary]}
                onPress={() => setStep(2)}
              >
                <Text style={[styles.buttonText, styles.buttonTextSecondary]}>Back</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.button,
                  (!budget) && styles.buttonDisabled,
                ]}
                onPress={handleSubmit}
                disabled={!budget}
              >
                <Text style={styles.buttonText}>Post Task</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#006600',
    padding: 24,
    paddingTop: 40,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 16,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
  stepIndicator: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 16,
  },
  stepBarContainer: {
    flex: 1,
  },
  stepBar: {
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  stepBarActive: {
    backgroundColor: '#fff',
  },
  stepLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  stepLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
  },
  scrollView: {
    flex: 1,
  },
  formContainer: {
    padding: 24,
    maxWidth: 400,
    alignSelf: 'center',
    width: '100%',
  },
  stepContent: {
    gap: 16,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  inputIcon: {
    marginLeft: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  inputWithIcon: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    paddingLeft: 8,
  },
  textArea: {
    minHeight: 100,
    paddingTop: 12,
  },
  selectContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  hint: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  uploadOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  uploadArea: {
    flex: 1,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#fafafa',
  },
  uploadText: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    fontWeight: '500',
  },
  uploadSubtext: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  attachedMediaContainer: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
  },
  attachedImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  videoPreview: {
    width: '100%',
    height: 200,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoPreviewText: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  dateTimeText: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  mapPlaceholder: {
    backgroundColor: '#e0e0e0',
    borderRadius: 12,
    height: 192,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapPlaceholderText: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
    fontWeight: '500',
  },
  mapPlaceholderSubtext: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  button: {
    backgroundColor: '#006600',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonSecondary: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonTextSecondary: {
    color: '#333',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
});
