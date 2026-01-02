import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { AppContextType } from '../../types';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

interface FAQ {
  question: string;
  answer: string;
}

export function HelpSupport({ context }: { context: AppContextType }) {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [showContactForm, setShowContactForm] = useState(false);
  const [message, setMessage] = useState('');
  const [subject, setSubject] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  const faqs: FAQ[] = [
    {
      question: 'How do I post a task?',
      answer: 'Click the "Post a Task" button on your dashboard, fill in the task details including title, description, budget, and preferred date. Workers will start bidding on your task.',
    },
    {
      question: 'How does the bidding process work?',
      answer: 'Once you post a task, nearby workers will submit their bids with their proposed price and timeline. You can review their profiles, ratings, and choose the best worker for your task.',
    },
    {
      question: 'What payment methods are accepted?',
      answer: 'Currently, we support cash payment to workers upon job completion. Online payment methods are coming soon.',
    },
    {
      question: 'How can I track my job?',
      answer: 'Once you accept a bid, you can track the worker\'s location in real-time and receive updates about job progress.',
    },
    {
      question: 'What if I\'m not satisfied with the work?',
      answer: 'You can rate and review the worker after job completion. If you face any issues, contact our support team immediately.',
    },
    {
      question: 'How do I become a verified worker?',
      answer: 'Upload your CNIC and skill certificates in your profile. Our team will verify your documents within 24-48 hours.',
    },
  ];

  const handleSubmit = () => {
    setShowConfirmation(true);
    setTimeout(() => {
      setShowContactForm(false);
      setMessage('');
      setSubject('');
      setShowConfirmation(false);
    }, 2000);
  };

  if (showConfirmation) {
    return (
      <View style={styles.confirmationContainer}>
        <Animated.View
          entering={FadeIn}
          exiting={FadeOut}
          style={styles.confirmationContent}
        >
          <View style={styles.checkCircle}>
            <Ionicons name="checkmark-circle" size={48} color="#00A86B" />
          </View>
          <Text style={styles.confirmationTitle}>Message Sent!</Text>
          <Text style={styles.confirmationText}>We'll get back to you within 24 hours</Text>
        </Animated.View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} bounces={false} scrollEventThrottle={16}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            onPress={() => context.setScreen(context.userRole === 'customer' ? 'customer-profile' : 'worker-profile')}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Help & Support</Text>
        </View>
      </View>

      <View style={styles.content}>
        {!showContactForm ? (
          <>
            {/* Contact Options */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Contact Us</Text>
              
              <View style={styles.contactOptions}>
                {/* Email */}
                <View style={styles.contactItem}>
                  <View style={[styles.contactIcon, { backgroundColor: '#e8f5e9' }]}>
                    <Ionicons name="mail" size={20} color="#006600" />
                  </View>
                  <View style={styles.contactInfo}>
                    <Text style={styles.contactLabel}>Email</Text>
                    <Text style={styles.contactValue}>support@karigargo.pk</Text>
                  </View>
                </View>

                {/* Phone */}
                <View style={styles.contactItem}>
                  <View style={[styles.contactIcon, { backgroundColor: '#e3f2fd' }]}>
                    <Ionicons name="call" size={20} color="#1976d2" />
                  </View>
                  <View style={styles.contactInfo}>
                    <Text style={styles.contactLabel}>Helpline</Text>
                    <Text style={styles.contactValue}>0300-1234567</Text>
                  </View>
                </View>

                {/* Message Support */}
                <TouchableOpacity
                  style={styles.messageButton}
                  onPress={() => setShowContactForm(true)}
                >
                  <Ionicons name="chatbubble-ellipses" size={20} color="#fff" />
                  <Text style={styles.messageButtonText}>Send Message</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* FAQs */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Frequently Asked Questions</Text>
              
              <View style={styles.faqList}>
                {faqs.map((faq, index) => (
                  <View key={index} style={styles.faqItem}>
                    <TouchableOpacity
                      style={styles.faqHeader}
                      onPress={() => setExpandedFaq(expandedFaq === index ? null : index)}
                    >
                      <Text style={styles.faqQuestion}>{faq.question}</Text>
                      <Ionicons
                        name={expandedFaq === index ? 'chevron-up' : 'chevron-down'}
                        size={20}
                        color="#666"
                      />
                    </TouchableOpacity>
                    {expandedFaq === index && (
                      <View style={styles.faqAnswer}>
                        <Text style={styles.faqAnswerText}>{faq.answer}</Text>
                      </View>
                    )}
                  </View>
                ))}
              </View>
            </View>

            {/* Working Hours */}
            <View style={[styles.card, styles.hoursCard]}>
              <Text style={styles.hoursTitle}>Support Hours</Text>
              <Text style={styles.hoursText}>
                Monday - Saturday: 9:00 AM - 6:00 PM{'\n'}
                Sunday: 10:00 AM - 4:00 PM
              </Text>
            </View>
          </>
        ) : (
          /* Contact Form */
          <View style={styles.card}>
            <View style={styles.formHeader}>
              <Text style={styles.cardTitle}>Contact Support</Text>
              <TouchableOpacity
                onPress={() => setShowContactForm(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Subject</Text>
                <TextInput
                  style={styles.input}
                  placeholder="What do you need help with?"
                  value={subject}
                  onChangeText={setSubject}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Message</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Describe your issue or question..."
                  value={message}
                  onChangeText={setMessage}
                  multiline
                  numberOfLines={6}
                  textAlignVertical="top"
                />
              </View>

              <TouchableOpacity
                style={[
                  styles.submitButton,
                  (!subject.trim() || !message.trim()) && styles.submitButtonDisabled,
                ]}
                onPress={handleSubmit}
                disabled={!subject.trim() || !message.trim()}
              >
                <Text style={styles.submitButtonText}>Send Message</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
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
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
  content: {
    padding: 24,
    gap: 24,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#333',
  },
  contactOptions: {
    gap: 12,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
  },
  contactIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactInfo: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  contactValue: {
    fontSize: 16,
    color: '#006600',
    fontWeight: '500',
  },
  messageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#006600',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  messageButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  faqList: {
    gap: 12,
  },
  faqItem: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    overflow: 'hidden',
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  faqQuestion: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  faqAnswer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  faqAnswerText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  hoursCard: {
    backgroundColor: '#e3f2fd',
  },
  hoursTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1565c0',
    marginBottom: 8,
  },
  hoursText: {
    fontSize: 14,
    color: '#1976d2',
    lineHeight: 20,
  },
  formHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  closeButton: {
    padding: 4,
  },
  form: {
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
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  textArea: {
    minHeight: 120,
    paddingTop: 12,
  },
  submitButton: {
    backgroundColor: '#006600',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  confirmationContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  confirmationContent: {
    alignItems: 'center',
  },
  checkCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#e8f5e9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  confirmationTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  confirmationText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});
