import React, { useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Image, Modal, Alert } from 'react-native';
import { AppContextType } from '../../types';
import { Message } from '../../types';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Audio } from 'expo-av';
import { subscribeToMessages, sendMessage, MessageData } from '../../services/firestoreService';

interface ExtendedMessage extends Message {
  type?: 'text' | 'image' | 'video' | 'voice';
  mediaUri?: string;
  voiceDuration?: number;
}

export function WorkerMessages({ context }: { context: AppContextType }) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ExtendedMessage[]>([]);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const messagesEndRef = useRef<ScrollView>(null);

  const jobId = context.currentTask?.id;
  const currentUserId = context.currentUser?.id;

  const customerName = context.currentTask?.customerName || 'Customer';
  const customerPhoto = context.currentTask?.customerProfilePicture ||
                       'https://api.dicebear.com/7.x/avataaars/svg?seed=' + customerName;

  // Subscribe to real-time messages
  useEffect(() => {
    if (!jobId) return;

    const unsubscribe = subscribeToMessages(jobId, (firestoreMessages: MessageData[]) => {
      const convertedMessages: ExtendedMessage[] = firestoreMessages.map((msg) => ({
        id: msg.id,
        senderId: msg.senderId,
        text: msg.text,
        timestamp: msg.createdAt 
          ? new Date(msg.createdAt.seconds * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
          : msg.timestamp,
        isCustomer: msg.isCustomer,
        type: 'text' as const,
      }));

      setMessages(convertedMessages);
      
      setTimeout(() => {
        messagesEndRef.current?.scrollToEnd({ animated: true });
      }, 100);
    });

    return () => unsubscribe();
  }, [jobId]);

  const handleSend = async () => {
    if (!message.trim() || !jobId || !currentUserId) return;

    try {
      await sendMessage({
        jobId: jobId,
        senderId: currentUserId,
        text: message,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        isCustomer: false,
      });

      setMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
      Alert.alert('Error', 'Failed to send message');
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
        senderId: context.currentUser?.id || 'worker-1',
        text: '',
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        isCustomer: false,
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
        senderId: context.currentUser?.id || 'worker-1',
        text: '',
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        isCustomer: false,
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
          senderId: context.currentUser?.id || 'worker-1',
          text: '',
          timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          isCustomer: false,
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
          <TouchableOpacity activeOpacity={1} onPress={() => context.setScreen('available-jobs')}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Image
            source={{ uri: customerPhoto }}
            style={styles.headerAvatar}
          />
          <View style={styles.headerInfo}>
            <Text style={styles.headerName}>{customerName}</Text>
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
            {msg.isCustomer && (
              <Image
                source={{ uri: customerPhoto }}
                style={styles.messageAvatar}
              />
            )}
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
            {!msg.isCustomer && (
              <Image
                source={{ 
                  uri: context.currentUser?.profilePicture || 
                  'https://api.dicebear.com/7.x/avataaars/svg?seed=' + (context.currentUser?.name || 'Worker')
                }}
                style={styles.messageAvatar}
              />
            )}
          </View>
        ))}
      </ScrollView>

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
              onChangeText={(text) => {
                // Only allow letters, spaces, and basic punctuation
                const cleaned = text.replace(/[^a-zA-Z\s.,!?'-]/g, '');
                setMessage(cleaned);
              }}
              multiline
              maxLength={500}
              autoCapitalize="sentences"
            />
            <TouchableOpacity
              activeOpacity={1}
style={styles.recordButton}
              onPress={startRecording}
            >
              <Ionicons name="mic" size={24} color="#006600" />
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
        animationType="fade"
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
              <Ionicons name="image-outline" size={24} color="#006600" />
              <Text style={styles.modalOptionText}>Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={1}
          style={styles.modalOption} onPress={handlePickVideo}>
              <Ionicons name="videocam-outline" size={24} color="#006600" />
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
              <Ionicons name="mic-outline" size={24} color="#006600" />
              <Text style={styles.modalOptionText}>Voice</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
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
  headerInfo: { flex: 1 },
  headerName: { color: '#fff', fontSize: 16, fontWeight: '500' },
  onlineIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10b981',
  },
  onlineText: { color: 'rgba(255, 255, 255, 0.8)', fontSize: 12 },
  messagesContainer: { flex: 1 },
  messagesContent: { padding: 16, gap: 12 },
  messageWrapper: {
    maxWidth: '75%',
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  customerWrapper: {
    alignSelf: 'flex-start',
  },
  workerWrapper: {
    alignSelf: 'flex-end',
    flexDirection: 'row-reverse',
  },
  messageAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  messageBubble: {
    borderRadius: 16,
    padding: 12,
  },
  customerMessage: {
    backgroundColor: '#e5e7eb',
    borderBottomLeftRadius: 4,
  },
  workerMessage: {
    backgroundColor: '#006600',
    borderBottomRightRadius: 4,
  },
  messageText: {
    fontSize: 16,
    color: '#333',
  },
  customerMessageText: {
    color: '#fff',
  },
  timestamp: {
    fontSize: 11,
    color: '#666',
    marginTop: 4,
  },
  customerTimestamp: {
    color: 'rgba(255, 255, 255, 0.7)',
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
  },
  voiceDuration: {
    fontSize: 14,
    color: '#666',
  },
  customerVoiceText: {
    color: '#fff',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    gap: 8,
  },
  attachButton: {
    padding: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 100,
    fontSize: 16,
  },
  recordButton: {
    padding: 8,
  },
  sendButton: {
    backgroundColor: '#006600',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc',
  },
  recordingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    flex: 1,
    paddingVertical: 8,
  },
  recordingIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#ef4444',
  },
  recordingText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ef4444',
  },
  stopButton: {
    backgroundColor: '#ef4444',
    width: 40,
    height: 40,
    borderRadius: 20,
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
    paddingBottom: 40,
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

