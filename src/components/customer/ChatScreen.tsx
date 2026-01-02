import React, { useState, useRef } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Image, Modal, Alert } from 'react-native';
import { AppContextType } from '../../types';
import { Message } from '../../types';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Audio } from 'expo-av';

interface ExtendedMessage extends Message {
  type?: 'text' | 'image' | 'video' | 'voice';
  mediaUri?: string;
  voiceDuration?: number;
}

export function ChatScreen({ context }: { context: AppContextType }) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ExtendedMessage[]>([
    {
      id: '1',
      senderId: 'worker-1',
      text: 'Hello! I can help you with this task. When would you like me to start?',
      timestamp: '10:30 AM',
      isCustomer: false,
      type: 'text',
    },
    {
      id: '2',
      senderId: 'customer-1',
      text: 'Hi! Can you come tomorrow morning?',
      timestamp: '10:32 AM',
      isCustomer: true,
      type: 'text',
    },
  ]);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);

  const workerName = context.selectedWorker?.name || context.selectedBid?.workerName || 'Worker';
  const workerPhoto = context.selectedWorker?.photo || context.selectedBid?.workerPhoto || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Worker';

  const handleSend = () => {
    if (message.trim()) {
      const newMessage: ExtendedMessage = {
        id: `msg-${Date.now()}`,
        senderId: context.currentUser?.id || 'customer-1',
        text: message,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        isCustomer: true,
        type: 'text',
      };
      setMessages([...messages, newMessage]);
      setMessage('');
    }
  };

  const handlePickImage = async () => {
    setShowAttachmentMenu(false);
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
      const newMessage: ExtendedMessage = {
        id: `msg-${Date.now()}`,
        senderId: context.currentUser?.id || 'customer-1',
        text: '',
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        isCustomer: true,
        type: 'image',
        mediaUri: result.assets[0].uri,
      };
      setMessages([...messages, newMessage]);
    }
  };

  const handlePickVideo = async () => {
    setShowAttachmentMenu(false);
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
      const newMessage: ExtendedMessage = {
        id: `msg-${Date.now()}`,
        senderId: context.currentUser?.id || 'customer-1',
        text: '',
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        isCustomer: true,
        type: 'video',
        mediaUri: result.assets[0].uri,
      };
      setMessages([...messages, newMessage]);
    }
  };

  const startRecording = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant microphone permissions');
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      setIsRecording(true);
      setRecordingDuration(0);

      recordingTimerRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error('Failed to start recording', err);
      Alert.alert('Error', 'Failed to start recording');
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    try {
      setIsRecording(false);
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }

      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();

      if (uri) {
        const newMessage: ExtendedMessage = {
          id: `msg-${Date.now()}`,
          senderId: context.currentUser?.id || 'customer-1',
          text: '',
          timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          isCustomer: true,
          type: 'voice',
          mediaUri: uri,
          voiceDuration: recordingDuration,
        };
        setMessages([...messages, newMessage]);
      }

      setRecording(null);
      setRecordingDuration(0);
    } catch (err) {
      console.error('Failed to stop recording', err);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={90}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity activeOpacity={1} onPress={() => context.setScreen('customer-dashboard')}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Image
            source={{ uri: workerPhoto }}
            style={styles.headerAvatar}
          />
          <View style={styles.headerInfo}>
            <Text style={styles.headerName}>{workerName}</Text>
            <View style={styles.onlineIndicator}>
              <View style={styles.onlineDot} />
              <Text style={styles.onlineText}>Online</Text>
            </View>
          </View>
          <TouchableOpacity activeOpacity={1}>
            <Ionicons name="ellipsis-vertical" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Messages */}
      <ScrollView 
        style={styles.messagesContainer} 
        contentContainerStyle={styles.messagesContent} 
        bounces={false}
        alwaysBounceVertical={false}
        overScrollMode="never"
        nestedScrollEnabled={false}
        contentInsetAdjustmentBehavior="never"
        automaticallyAdjustContentInsets={false}
        scrollEventThrottle={16}
        >
        {messages.map((msg) => (
          <View
            key={msg.id}
            style={[styles.messageWrapper, msg.isCustomer ? styles.customerWrapper : styles.workerWrapper]}
          >
            {msg.type === 'image' && msg.mediaUri ? (
              <View style={[styles.messageBubble, msg.isCustomer ? styles.customerMessage : styles.workerMessage]}>
                <Image source={{ uri: msg.mediaUri }} style={styles.messageImage} />
                <Text style={[styles.timestamp, msg.isCustomer && styles.customerTimestamp]}>
                  {msg.timestamp}
                </Text>
              </View>
            ) : msg.type === 'video' && msg.mediaUri ? (
              <View style={[styles.messageBubble, msg.isCustomer ? styles.customerMessage : styles.workerMessage]}>
                <View style={styles.videoContainer}>
                  <Ionicons name="play-circle" size={48} color="#fff" />
                  <Text style={styles.videoLabel}>Video</Text>
                </View>
                <Text style={[styles.timestamp, msg.isCustomer && styles.customerTimestamp]}>
                  {msg.timestamp}
                </Text>
              </View>
            ) : msg.type === 'voice' && msg.mediaUri ? (
              <View style={[styles.messageBubble, msg.isCustomer ? styles.customerMessage : styles.workerMessage]}>
                <View style={styles.voiceContainer}>
                  <Ionicons name="mic" size={20} color={msg.isCustomer ? '#fff' : '#666'} />
                  <Text style={[styles.voiceDuration, msg.isCustomer && styles.customerVoiceText]}>
                    {formatDuration(msg.voiceDuration || 0)}
                  </Text>
                  <Ionicons name="play-circle" size={24} color={msg.isCustomer ? '#fff' : '#666'} />
                </View>
                <Text style={[styles.timestamp, msg.isCustomer && styles.customerTimestamp]}>
                  {msg.timestamp}
                </Text>
              </View>
            ) : (
              <View style={[styles.messageBubble, msg.isCustomer ? styles.customerMessage : styles.workerMessage]}>
                <Text style={[styles.messageText, msg.isCustomer && styles.customerMessageText]}>
                  {msg.text}
                </Text>
                <Text style={[styles.timestamp, msg.isCustomer && styles.customerTimestamp]}>
                  {msg.timestamp}
                </Text>
              </View>
            )}
          </View>
        ))}
      </ScrollView>

      {/* Mark as Complete Option */}
      <View style={styles.completeSection}>
        <TouchableOpacity
          activeOpacity={1}
style={styles.completeButton}
          onPress={() => context.setScreen('payment')}
        >
          <Text style={styles.completeButtonText}>Mark Job as Complete</Text>
        </TouchableOpacity>
      </View>

      {/* Input Area */}
      <View style={styles.inputContainer}>
        {isRecording ? (
          <View style={styles.recordingContainer}>
            <View style={styles.recordingIndicator} />
            <Text style={styles.recordingText}>{formatDuration(recordingDuration)}</Text>
            <TouchableOpacity activeOpacity={1} onPress={stopRecording} style={styles.stopButton}>
              <Ionicons name="stop" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <TouchableOpacity
              activeOpacity={1}
style={styles.attachButton}
              onPress={() => setShowAttachmentMenu(true)}
            >
              <Ionicons name="attach" size={24} color="#666" />
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              placeholder="Type a message..."
              value={message}
              onChangeText={setMessage}
              multiline
              maxLength={500}
            />
            <TouchableOpacity
              activeOpacity={1}
style={styles.voiceButton}
              onPress={startRecording}
              onLongPress={startRecording}
            >
              <Ionicons name="mic" size={24} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={1}
style={[styles.sendButton, !message.trim() && styles.sendButtonDisabled]}
              onPress={handleSend}
              disabled={!message.trim()}
            >
              <Ionicons name="send" size={20} color="#fff" />
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* Attachment Menu Modal */}
      <Modal
        visible={showAttachmentMenu}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAttachmentMenu(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={styles.modalOverlay}
          onPress={() => setShowAttachmentMenu(false)}
        >
          <View style={styles.modalContent}>
            <TouchableOpacity activeOpacity={1}
          style={styles.modalOption} onPress={handlePickImage}>
              <Ionicons name="image" size={24} color="#006600" />
              <Text style={styles.modalOptionText}>Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={1}
          style={styles.modalOption} onPress={handlePickVideo}>
              <Ionicons name="videocam" size={24} color="#006600" />
              <Text style={styles.modalOptionText}>Video</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={1}
style={styles.modalOption}
              onPress={() => {
                setShowAttachmentMenu(false);
                startRecording();
              }}
            >
              <Ionicons name="mic" size={24} color="#006600" />
              <Text style={styles.modalOptionText}>Voice</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#006600',
    padding: 16,
    paddingTop: 40,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#fff',
  },
  headerInfo: {
    flex: 1,
  },
  headerName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  onlineIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4ade80',
  },
  onlineText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    gap: 12,
  },
  messageWrapper: {
    maxWidth: '75%',
    marginBottom: 4,
  },
  customerWrapper: {
    alignSelf: 'flex-end',
  },
  workerWrapper: {
    alignSelf: 'flex-start',
  },
  messageBubble: {
    padding: 12,
    borderRadius: 16,
  },
  customerMessage: {
    backgroundColor: '#006600',
    borderBottomRightRadius: 4,
  },
  workerMessage: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    color: '#333',
  },
  customerMessageText: {
    color: '#fff',
  },
  messageImage: {
    width: 200,
    height: 200,
    borderRadius: 12,
    marginBottom: 4,
  },
  videoContainer: {
    width: 200,
    height: 150,
    backgroundColor: '#000',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  videoLabel: {
    color: '#fff',
    marginTop: 8,
    fontSize: 12,
  },
  voiceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
  },
  voiceDuration: {
    fontSize: 14,
    color: '#666',
    minWidth: 40,
  },
  customerVoiceText: {
    color: '#fff',
  },
  timestamp: {
    fontSize: 10,
    color: '#999',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  customerTimestamp: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  completeSection: {
    padding: 12,
    backgroundColor: '#fef3c7',
    borderTopWidth: 1,
    borderTopColor: '#fde68a',
  },
  completeButton: {
    borderWidth: 1,
    borderColor: '#006600',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  completeButtonText: {
    color: '#006600',
    fontSize: 14,
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    alignItems: 'flex-end',
    gap: 8,
  },
  attachButton: {
    padding: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 100,
    fontSize: 16,
  },
  voiceButton: {
    padding: 8,
  },
  sendButton: {
    backgroundColor: '#006600',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc',
  },
  recordingContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 8,
    backgroundColor: '#fee',
    borderRadius: 20,
  },
  recordingIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#f00',
  },
  recordingText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#c00',
  },
  stopButton: {
    backgroundColor: '#c00',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  modalOption: {
    alignItems: 'center',
    gap: 8,
  },
  modalOptionText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
});
