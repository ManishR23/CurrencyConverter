/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Pressable,
  registerCallableModule,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from 'react-native';

//Constants
import { currencyByDollar } from './constants';

//Component
import CurrencyButton from './components/CurrencyButton';

import Snackbar from 'react-native-snackbar';

function App(): JSX.Element {
  const [inputValue, setInputValue] = useState('');
  const [resultValue, setResultValue] = useState('$0');
  const [targetCurrency, setTargetCurrency] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [filteredCurrencies, setFilteredCurrencies] = useState<Currency[]>([]);

  useEffect(() => {
    const fetchCurrencies = async () => {
      const data = await currencyByDollar();
      setCurrencies(data);
      setFilteredCurrencies(data);
    };
    fetchCurrencies();
  }, []);

  useEffect(() => {
    setFilteredCurrencies(
      currencies.filter(currency =>
        currency.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, currencies]);

  const buttonPressed = (targetValue: Currency) => {
    if (!inputValue) {
      return Snackbar.show({
        text: 'Enter a value to convert',
        backgroundColor: '#EA7773',
        textColor: '#000000',
      });
    }

    const inputAmount = parseFloat(inputValue);
    if (!isNaN(inputAmount)) {
      const convertedValue = inputAmount * targetValue.value;
      const result = `${targetValue.symbol} ${convertedValue.toFixed(2)}`;
      setResultValue(result);
      setTargetCurrency(targetValue.name);
    } else {
      return Snackbar.show({
        text: 'Not a valid number to convert!',
        backgroundColor: '#F4BE2C',
        textColor: '#000000',
      });
    }
  };

  const reset = () => {
    setResultValue('$0')
  }

  return (
    <>
      <View style={styles.container}>
        <View style={styles.topContainer}>
          <View style={styles.rupeesContainer}>
            <Text style={styles.rupee}>$</Text>
            <TextInput
              style={styles.dollarText}
              maxLength={14}
              value={inputValue}
              clearButtonMode='always'
              onChangeText={setInputValue}
              keyboardType='number-pad'
              placeholder='Enter'
            />
          </View>
          {resultValue && (
            <Text style={styles.resultTxt}>{resultValue}</Text>
          )}
          <View style={styles.searchBar}>
            <TextInput
              style={styles.searchText}
              placeholder='Search currencies'
              onChangeText={setSearchQuery}
              value={searchQuery}
            />
          </View>
        </View>
        <View style={styles.bottomContainer}>
          <FlatList
            numColumns={1}
            data={filteredCurrencies}
            keyExtractor={item => item.name}
            renderItem={({ item }) => (
              <Pressable
                style={[
                  styles.button,
                  targetCurrency === item.name && styles.selected,
                ]}
                onPress={() => buttonPressed(item)}
              >
                <CurrencyButton {...item} />
              </Pressable>
            )}
          />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#515151',
  },
  topContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultTxt: {
    fontSize: 32,
    color: '#000000',
    fontWeight: '800',
  },
  rupee: {
    fontSize: 20,
    color: '#000000',
    fontWeight: 'bold',
  },
  rupeesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputAmountField: {
    height: 40,
    width: 200,
    padding: 8,
    borderWidth: 1,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  bottomContainer: {
    flex: 3,
  },
  searchBar: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  searchText: {
    fontSize: 15,
    color: 'white'
  },
  button: {
    flex: 1,

    margin: 12,
    height: 60,

    borderRadius: 12,
    backgroundColor: '#fff',
    elevation: 2,
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowColor: '#333',
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  selected: {
    backgroundColor: '#ffeaa7',
  },
  dollarText: {
    fontSize: 20,
    color: '#000000',
  }
});



export default App;
