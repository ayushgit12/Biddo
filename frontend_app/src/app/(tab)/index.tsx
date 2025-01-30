import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define types based on backend schema
type Product = {
  _id: string;
  name: string;
  description: string;
  currentPrice: number;
  category: string;
  productImages: string[];
  isBid: boolean;
  isSold: boolean;
  highestBidderId: string;
  bidStartTime: string;
  createdAt: string;
  updatedAt: string;
};

const BiddingItem = ({ item, isOngoing = true, onRefresh }: { item: Product; isOngoing: boolean; onRefresh: () => void }) => {
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [bidAmount, setBidAmount] = useState(item.currentPrice + 10);

  useEffect(() => {
    // Get userId from AsyncStorage
    const getUserId = async () => {
      const id = await AsyncStorage.getItem('userId');
      setUserId(id);
    };
    getUserId();
  }, []);

  useEffect(() => {
    if (isOngoing && item.bidStartTime) {
      const timer = setInterval(() => {
        const endTime = new Date(item.bidStartTime).getTime() + (24 * 60 * 60 * 1000); // 24 hours
        const now = new Date().getTime();
        const distance = endTime - now;

        if (distance < 0) {
          setTimeLeft('Ended');
          clearInterval(timer);
        } else {
          const hours = Math.floor(distance / (1000 * 60 * 60));
          const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((distance % (1000 * 60)) / 1000);
          setTimeLeft(`${hours}:${minutes}:${seconds}`);
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [item.bidStartTime]);

  const handleBid = async () => {
    try {
      if (bidAmount <= item.currentPrice) {
        Alert.alert('Error', 'Offered price must be higher than current price');
        return;
      }

      setLoading(true);
      const token = await AsyncStorage.getItem('userToken');
      const response = await fetch('http://localhost:8000/api/products/bidProduct', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: item._id,
          offeredPrice: bidAmount,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        onRefresh();
      } else {
        Alert.alert('Error', data.message);
      }
    } catch (error) {
      console.error('Bid error:', error);
      Alert.alert('Error', 'Failed to place bid');
    } finally {
      setLoading(false);
    }
  };

  const showBidDialog = () => {
    Alert.prompt(
      'Place Bid',
      `Current bid is $${item.currentPrice}. Enter your bid amount:`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Bid',
          onPress: (amount) => {
            const newAmount = parseFloat(amount || '0');
            if (newAmount > item.currentPrice) {
              setBidAmount(newAmount);
              handleBid();
            } else {
              Alert.alert('Error', 'Bid amount must be higher than current price');
            }
          },
        },
      ],
      'plain-text',
      item.currentPrice.toString(),
    );
  };

  const startBidding = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('userToken');
      const response = await fetch('http://localhost:8000/api/products/bidProduct', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: item._id,
          offeredPrice: item.currentPrice,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        onRefresh();
      } else {
        Alert.alert('Error', data.message);
      }
    } catch (error) {
      console.error('Start bid error:', error);
      Alert.alert('Error', 'Failed to start bidding');
    } finally {
      setLoading(false);
    }
  };

  const isMyBid = item.highestBidderId === userId;
  const isBidExpired = item.bidStartTime && new Date(item.bidStartTime).getTime() + (24 * 60 * 60 * 1000) <= Date.now();

  return (
    <View style={styles.card}>
      <Image
        source={{ uri: item.productImages[0] || 'https://via.placeholder.com/150' }}
        style={styles.productImage}
      />
      <View style={styles.productInfo}>
        <View style={styles.productHeader}>
          <Text style={styles.productName}>{item.name}</Text>
          <Text style={styles.category}>{item.category}</Text>
        </View>

        <Text style={styles.description} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.bidInfo}>
          <View>
            <Text style={styles.currentBid}>
              Current Bid: ${item.currentPrice}
            </Text>
            {isMyBid && (
              <Text style={styles.highestBidder}>You are the highest bidder!</Text>
            )}
          </View>
          {isOngoing && !item.isSold && (
            <View style={styles.timeContainer}>
              <Ionicons name="time-outline" size={20} color="#dc3545" />
              <Text style={styles.timer}>{timeLeft}</Text>
            </View>
          )}
        </View>

        {!item.isSold && !isBidExpired && (
          <TouchableOpacity
            style={[
              styles.bidButton,
              !isOngoing && styles.startBidButton,
              isMyBid && styles.highestBidButton,
              loading && styles.loadingButton
            ]}
            disabled={isMyBid || loading}
            onPress={isOngoing ? showBidDialog : startBidding}
          >
            {loading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Text style={styles.bidButtonText}>
                {isMyBid ? 'Highest Bid' : isOngoing ? 'Place Bid' : 'Start Bidding'}
              </Text>
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const HomeScreen = () => {
  const [activeTab, setActiveTab] = useState('ongoing');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, [activeTab]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('userToken');
      const endpoint = activeTab === 'ongoing'
        ? 'getProducts'  // For ongoing bids
        : 'getUnsoldProducts'; // For not bid yet products

      const response = await fetch(
        `http://localhost:8000/api/products/${endpoint}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderList = () => (
    <FlatList
      data={products}
      renderItem={({ item }) => (
        <BiddingItem
          item={item}
          isOngoing={activeTab === 'ongoing'}
          onRefresh={fetchProducts}
        />
      )}
      keyExtractor={item => item._id}
      showsVerticalScrollIndicator={false}
      onRefresh={fetchProducts}
      refreshing={loading}
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'ongoing' && styles.activeTab]}
          onPress={() => setActiveTab('ongoing')}
        >
          <Text style={[styles.tabText, activeTab === 'ongoing' && styles.activeTabText]}>
            Ongoing Bids
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'notBid' && styles.activeTab]}
          onPress={() => setActiveTab('notBid')}
        >
          <Text style={[styles.tabText, activeTab === 'notBid' && styles.activeTabText]}>
            Not Bid Yet
          </Text>
        </TouchableOpacity>
      </View>

      {renderList()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: '#fff',
  },
  tabText: {
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#007AFF',
  },
  card: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 15,
  },
  productInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  productHeader: {
    marginBottom: 4,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  category: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  bidInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  currentBid: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: 'bold',
  },
  highestBidder: {
    fontSize: 12,
    color: '#28a745',
    marginTop: 2,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timer: {
    color: '#dc3545',
    marginLeft: 4,
    fontWeight: '500',
  },
  bidButton: {
    backgroundColor: '#007AFF',
    padding: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  startBidButton: {
    backgroundColor: '#28a745',
  },
  highestBidButton: {
    backgroundColor: '#666',
  },
  bidButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  loadingButton: {
    opacity: 0.7,
  },
});

export default HomeScreen;