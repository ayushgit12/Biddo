import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import React from 'react';

const ProductItem = ({ item }) => (
    <View style={styles.card}>
        <Image
            source={{ uri: 'https://via.placeholder.com/150' }}
            style={styles.productImage}
        />
        <View style={styles.productContent}>
            <View style={styles.productHeader}>
                <Text style={styles.productName}>Product Name</Text>
                <Text style={styles.status}>Status: Active</Text>
            </View>

            <View style={styles.bidInfo}>
                <Text style={styles.currentBid}>Current Bid: $150</Text>
                <Text style={styles.bidCount}>Total Bids: 3</Text>
            </View>

            <View style={styles.bidderInfo}>
                <Text style={styles.bidderName}>Top Bidder: @username</Text>
                <Text style={styles.timeLeft}>Time Left: 12:30:45</Text>
            </View>
        </View>
    </View>
);

const MyProducts = () => {
    const [activeTab, setActiveTab] = React.useState('myListings');

    return (
        <View style={styles.container}>
            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'myListings' && styles.activeTab]}
                    onPress={() => setActiveTab('myListings')}
                >
                    <Text style={[styles.tabText, activeTab === 'myListings' && styles.activeTabText]}>
                        My Listings
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'myBids' && styles.activeTab]}
                    onPress={() => setActiveTab('myBids')}
                >
                    <Text style={[styles.tabText, activeTab === 'myBids' && styles.activeTabText]}>
                        My Bids
                    </Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={[1, 2, 3]}
                renderItem={({ item }) => <ProductItem item={item} />}
                keyExtractor={item => item.toString()}
                showsVerticalScrollIndicator={false}
            />
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
        width: 80,
        height: 80,
        borderRadius: 8,
        marginRight: 15,
    },
    productContent: {
        flex: 1,
    },
    productHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    productName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    status: {
        color: '#28a745',
        fontWeight: '500',
    },
    bidInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    currentBid: {
        fontSize: 16,
        color: '#007AFF',
    },
    bidCount: {
        color: '#666',
    },
    bidderInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    bidderName: {
        color: '#666',
    },
    timeLeft: {
        color: '#dc3545',
    },
});

export default MyProducts; 