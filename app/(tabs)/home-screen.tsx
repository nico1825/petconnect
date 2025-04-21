import React, { useEffect, useState } from 'react';
import {View, Text, FlatList, ActivityIndicator, StyleSheet, SafeAreaView, Image, Button, TextInput, TouchableOpacity, Modal} from 'react-native';
import api from '../services/api';

export default function HomeScreen() {
  const [lostPets, setLostPets] = useState<any[]>([]);
  const [adoptions, setAdoptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({location: '', breed: '', date: ''});
  const [filterVisible, setFilterVisible] = useState(false);
  const filtersApplied = !!(filters.location || filters.breed || filters.date);



  const fetchLost = async (useFilters = false) => {
      try {
        let res;
        if (useFilters) {
          const query = new URLSearchParams(filters).toString();
          res = await api.get(`/lostpets/search?${query}`);
        } else {
          res = await api.get('/lostpets');
        }
        setLostPets(res.data);
      } catch (err: any) {
        console.error('Error fetching lost pets:', err.response?.data || err.message);
      }
    };

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      await fetchLost(); // ← works now
      if (mounted) setLoading(false);
    };

    const fetchAdoptions = async () => {
      try {
        const res = await api.get('/adoptions');
        if (mounted) setAdoptions(res.data);
      } catch (err: any) {
        console.error('Error fetching adoptions:', err.response?.data || err.message);
      }
    };

    load();
    return () => {
      mounted = false
    };

  }, []);




  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Loading posts…</Text>
      </View>
    );
  }

  return (
    <SafeAreaView>
    <FlatList
      contentContainerStyle={{ paddingBottom: 100 }}
      ListHeaderComponent={
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', margin: 16 }}>
        <Text style={styles.header}>Lost Pets</Text>
        <TouchableOpacity onPress={() => setFilterVisible(true)}>
          <Text style={{ color: 'blue', fontSize: 16 }}>🔍 Filter</Text>
        </TouchableOpacity>
      </View>
      }
      data={lostPets}
      keyExtractor={item => item._id}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Status:</Text>
            <Text style={styles.value}>{item.status}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.value}>{item.pet?.name || 'Unnamed Pet'}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Last seen:</Text>
            <Text style={styles.value}>{item.lastSeenLocation}</Text>
          </View>

          <Text>Breed: {item.breed}</Text>

          <Text>Reported: { new Date(item.reportedAt).toLocaleString('en-US', {
            dateStyle: 'medium',
            timeStyle: 'short'
          })}</Text>
          <Text>Phone Number: {item.contactInfo.phone}</Text>
          <Text>Email: {item.contactInfo.email}</Text>
          {item.photoUrl ? (
          <Image
            source={{ uri: item.photoUrl }}
            style={styles.image}
            onError={() => console.log('❌ Failed to load image for', item.pet?.name)}
          />
          ) : (
            <Text style={styles.title}>{"NO IMAGE"}</Text>
          )}
        </View>
      )}
      ListFooterComponent={
        <>
          <Text style={styles.header}>Adoption Listings</Text>
          {adoptions.length === 0 && <Text style={styles.empty}>No listings yet.</Text>}
          {adoptions.map(listing => (
            <View key={listing._id} style={styles.card}>
              <Text style={styles.title}>Name: {listing.pet?.name || 'Unnamed Pet'}</Text>
              <Text>Contact: {listing.contactInfo?.email || listing.contactInfo?.phone}</Text>
            </View>
          ))}
        </>

      }
    />

    <Modal visible={filterVisible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={[styles.title, {marginBottom: 12}]}>Filter Lost Pets</Text>
          <TextInput
            placeholder="Location"
            value={filters.location}
            onChangeText={text => setFilters(prev => ({ ...prev, location: text }))}
            style={[styles.input, { marginBottom: 12 }]}
          />
          <TextInput
            placeholder="Breed"
            value={filters.breed}
            onChangeText={text => setFilters(prev => ({ ...prev, breed: text }))}
            style={[styles.input, { marginBottom: 12 }]}
          />
          <TextInput
            placeholder="Date (YYYY-MM-DD)"
            value={filters.date}
            onChangeText={text => setFilters(prev => ({ ...prev, date: text }))}
            style={[styles.input, { marginBottom: 12 }]}
          />

         <Button
            title="Apply Filters"
            onPress={() => {
              fetchLost(true);
              setFilterVisible(false);
            }}
          />

          {filtersApplied && (
            <View>
              <Button
                title="Clear Filters"
                color="gray"
                onPress={() => {
                  setFilters({ location: '', breed: '', date: '' });
                  fetchLost(false);
                  setFilterVisible(false);
                }}
              />
            </View>
          )}
          <Button title="Cancel" color="red" onPress={() => setFilterVisible(false)} />
        </View>
      </View>
    </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  infoRow: {flexDirection: 'row', alignItems: 'center', marginBottom: 4,},
  label: {fontWeight: '600', marginRight: 6, minWidth: 80,},
  value: {flex: 1,},
  modalOverlay: {flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center',},
  modalContainer: {backgroundColor: '#fff', padding: 20, borderRadius: 12, width: '85%',},
  input: {backgroundColor: '#eee', borderRadius: 6, padding: 10, marginBottom: 16,},
  image: {width: '100%', height: 180, borderRadius: 10, marginTop: 10, resizeMode: 'cover'},
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { fontSize: 20, fontWeight: 'bold', margin: 16 },
  empty: { textAlign: 'center', color: '#666', marginBottom: 16 },
  card: {backgroundColor: '#fff', marginHorizontal: 16, marginBottom: 12, padding: 12, borderRadius: 8, elevation: 2},
  title: { fontSize: 18, fontWeight: '600' }
});
