import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, FlatList} from 'react-native';
import {useApp} from '../services/AppContext';

const SAMPLE_ITEMS = [
  {id: '1', name: 'Alpha Item', category: 'technology'},
  {id: '2', name: 'Beta Product', category: 'lifestyle'},
  {id: '3', name: 'Gamma Service', category: 'technology'},
  {id: '4', name: 'Delta Tool', category: 'productivity'},
  {id: '5', name: 'Epsilon App', category: 'lifestyle'},
  {id: '6', name: 'Zeta Platform', category: 'technology'},
];

const ExploreScreen = () => {
  const {state, executeCommand} = useApp();
  const {exploreFilter, exploreSort} = state;

  const filteredItems = React.useMemo(() => {
    let items = [...SAMPLE_ITEMS];

    // Apply filter
    if (exploreFilter) {
      items = items.filter(item =>
        item.category.toLowerCase().includes(exploreFilter.toLowerCase()),
      );
    }

    // Apply sort
    items.sort((a, b) => {
      if (exploreSort === 'asc') {
        return a.name.localeCompare(b.name);
      } else {
        return b.name.localeCompare(a.name);
      }
    });

    return items;
  }, [exploreFilter, exploreSort]);

  const applyFilter = async (filter: string) => {
    await executeCommand({
      type: 'applyExploreFilter',
      payload: {filter, sort: exploreSort},
    });
  };

  const toggleSort = async () => {
    const newSort = exploreSort === 'asc' ? 'desc' : 'asc';
    await executeCommand({
      type: 'applyExploreFilter',
      payload: {filter: exploreFilter, sort: newSort},
    });
  };

  const clearFilter = async () => {
    await executeCommand({
      type: 'applyExploreFilter',
      payload: {filter: '', sort: exploreSort},
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Explore</Text>

      <View style={styles.controls}>
        <View style={styles.filterSection}>
          <Text style={styles.label}>Filter by category:</Text>
          <View style={styles.filterButtons}>
            <TouchableOpacity
              style={[
                styles.filterButton,
                exploreFilter === 'technology' && styles.activeFilter,
              ]}
              onPress={() => applyFilter('technology')}>
              <Text
                style={[
                  styles.filterText,
                  exploreFilter === 'technology' && styles.activeFilterText,
                ]}>
                Technology
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterButton,
                exploreFilter === 'lifestyle' && styles.activeFilter,
              ]}
              onPress={() => applyFilter('lifestyle')}>
              <Text
                style={[
                  styles.filterText,
                  exploreFilter === 'lifestyle' && styles.activeFilterText,
                ]}>
                Lifestyle
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterButton,
                exploreFilter === 'productivity' && styles.activeFilter,
              ]}
              onPress={() => applyFilter('productivity')}>
              <Text
                style={[
                  styles.filterText,
                  exploreFilter === 'productivity' && styles.activeFilterText,
                ]}>
                Productivity
              </Text>
            </TouchableOpacity>
          </View>
          {exploreFilter !== '' && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={clearFilter}>
              <Text style={styles.clearText}>Clear Filter</Text>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity style={styles.sortButton} onPress={toggleSort}>
          <Text style={styles.sortText}>
            Sort: {exploreSort === 'asc' ? 'A → Z' : 'Z → A'}
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredItems}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <View style={styles.item}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemCategory}>{item.category}</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            No items found matching the current filter.
          </Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    padding: 20,
    paddingBottom: 10,
  },
  controls: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  filterSection: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  filterButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  activeFilter: {
    backgroundColor: '#007AFF',
  },
  filterText: {
    fontSize: 14,
    color: '#333',
  },
  activeFilterText: {
    color: '#fff',
  },
  clearButton: {
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  clearText: {
    fontSize: 14,
    color: '#007AFF',
  },
  sortButton: {
    padding: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  sortText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  item: {
    backgroundColor: '#fff',
    padding: 16,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  itemCategory: {
    fontSize: 14,
    color: '#666',
    textTransform: 'capitalize',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 16,
    marginTop: 40,
    paddingHorizontal: 40,
  },
});

export default ExploreScreen;
