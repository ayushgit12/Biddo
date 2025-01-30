import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const About = () => {
  // Function to handle email support
  const handleContactSupport = () => {
    Linking.openURL('bishwath1235@gmail.com');
  };

  return (
    <ScrollView style={styles.container}>
      {/* Welcome Section */}
      <View style={styles.section}>
        <Text style={styles.title}>Welcome to BiddingApp</Text>
        <Text style={styles.description}>
          BiddingApp is your premier destination for online auctions and bidding. 
          We connect sellers with potential buyers in a secure, transparent, and 
          exciting marketplace where great deals come to life.
        </Text>
      </View>

      {/* How It Works Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>How It Works</Text>
        
        <View style={styles.stepContainer}>
          <MaterialIcons name="add-box" size={24} color="#007AFF" />
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>List Your Item</Text>
            <Text style={styles.stepDescription}>
              Sellers can list their items with a detailed description, photos, 
              and set a starting bid price. Your item will be visible to thousands 
              of potential buyers.
            </Text>
          </View>
        </View>

        <View style={styles.stepContainer}>
          <MaterialIcons name="gavel" size={24} color="#007AFF" />
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Place Your Bids</Text>
            <Text style={styles.stepDescription}>
              Buyers can browse items and place bids. Each bid starts a 24-hour 
              countdown. If no one outbids you within 24 hours, the item is yours!
            </Text>
          </View>
        </View>

        <View style={styles.stepContainer}>
          <MaterialIcons name="chat" size={24} color="#007AFF" />
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Secure Transaction</Text>
            <Text style={styles.stepDescription}>
              Once a bid wins, buyer and seller can communicate through our 
              platform to arrange payment and delivery details in a secure 
              environment.
            </Text>
          </View>
        </View>
      </View>

      {/* Platform Features */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Platform Features</Text>
        <Text style={styles.featureText}>• Real-time bidding updates</Text>
        <Text style={styles.featureText}>• Secure payment processing</Text>
        <Text style={styles.featureText}>• 24-hour bidding window</Text>
        <Text style={styles.featureText}>• In-app messaging system</Text>
        <Text style={styles.featureText}>• Detailed item tracking</Text>
        <Text style={styles.featureText}>• User ratings and reviews</Text>
      </View>

      {/* Trust & Safety */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Trust & Safety</Text>
        <Text style={styles.description}>
          Your security is our top priority. All transactions are monitored, 
          and our platform includes user verification, secure payment processing, 
          and a dispute resolution system to ensure a safe trading environment.
        </Text>
      </View>

      {/* Support Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Need Help?</Text>
        <TouchableOpacity 
          style={styles.supportButton}
          onPress={handleContactSupport}
        >
          <Text style={styles.buttonText}>Contact Support</Text>
        </TouchableOpacity>
      </View>

      {/* Version Info */}
      <View style={styles.footer}>
        <Text style={styles.version}>Version 1.0.0</Text>
        <Text style={styles.copyright}>
          © 2025 BiddingApp. All rights reserved.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  stepContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'flex-start',
  },
  stepContent: {
    flex: 1,
    marginLeft: 12,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  stepDescription: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
  },
  featureText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
    paddingLeft: 8,
  },
  supportButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  version: {
    fontSize: 14,
    color: '#999',
    marginBottom: 4,
  },
  copyright: {
    fontSize: 14,
    color: '#999',
  },
});

export default About;