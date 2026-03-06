import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, FlatList} from 'react-native';
import {useApp} from '../services/AppContext';
import Colors from '../constants/Colors';

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
  const darkMode = !!state.preferences.darkMode;
  const colors = darkMode ? Colors.dark : Colors.light;

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
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      <Text style={[styles.title, {color: colors.text}]}>Explore</Text>

      <View
        style={[
          styles.controls,
          {backgroundColor: colors.surface, borderBottomColor: colors.border},
        ]}>
        <View style={styles.filterSection}>
          <Text style={[styles.label, {color: colors.subtext}]}>Filter by category:</Text>
          <View style={styles.filterButtons}>
            <TouchableOpacity
              style={[
                styles.filterButton,
                {backgroundColor: colors.border},
                exploreFilter === 'technology' && {
                  backgroundColor: colors.primary,
                },
              ]}
              onPress={() => applyFilter('technology')}>
              <Text
                style={[
                  styles.filterText,
                  {color: colors.text},
                  exploreFilter === 'technology' && styles.activeFilterText,
                ]}>
                Technology
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterButton,
                {backgroundColor: colors.border},
                exploreFilter === 'lifestyle' && {backgroundColor: colors.primary},
              ]}
              onPress={() => applyFilter('lifestyle')}>
              <Text
                style={[
                  styles.filterText,
                  {color: colors.text},
                  exploreFilter === 'lifestyle' && styles.activeFilterText,
                ]}>
                Lifestyle
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterButton,
                {backgroundColor: colors.border},
                exploreFilter === 'productivity' && {
                  backgroundColor: colors.primary,
                },
              ]}
              onPress={() => applyFilter('productivity')}>
              <Text
                style={[
                  styles.filterText,
                  {color: colors.text},
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

        <TouchableOpacity
          style={[styles.sortButton, {backgroundColor: colors.border}]}
          onPress={toggleSort}>
          <Text style={[styles.sortText, {color: colors.text}]}>
            Sort: {exploreSort === 'asc' ? 'A → Z' : 'Z → A'}
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredItems}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <View style={[styles.item, {backgroundColor: colors.card}]}>
            <Text style={[styles.itemName, {color: colors.text}]}>{item.name}</Text>
            <Text style={[styles.itemCategory, {color: colors.subtext}]}>{item.category}</Text>
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
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    padding: 20,
    paddingBottom: 10,
  },
  controls: {
    padding: 16,
    borderBottomWidth: 1,
  },
  filterSection: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
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
  },
  activeFilter: {
    backgroundColor: '#007AFF', // Kept as it is a specific active state color, though usually primary
  },
  filterText: {
    fontSize: 14,
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
    borderRadius: 8,
  },
  sortText: {
    fontSize: 14,
    fontWeight: '500',
  },
  item: {
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
    marginBottom: 4,
  },
  itemCategory: {
    fontSize: 14,
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
