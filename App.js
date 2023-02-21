import React, { useState, useRef, useEffect } from 'react';
import config from './config.json';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
  FlatList
} from 'react-native';
import * as Print from 'expo-print';
import * as Share from 'expo-sharing';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { Picker } from '@react-native-picker/picker';



const App = () => {
  const [products, setProducts] = useState([
    { id: 1, name: 'Strogonoff de Frango', price: 20 },
    { id: 2, name: 'Strogonoff de Carne', price: 28 },
    { id: 3, name: 'Bacon c/ Catupiry', price: 23 },
    { id: 4, name: 'Bacon c/ Cheddar', price: 23 },
    {id: 5,  name: 'Calabresa c/ Catupiry', price: 23},
    {id: 6,  name: 'Calabresa c/ Cheddar', price: 23},
    {id: 7,  name: 'Pizza', price: 24},
    {id: 8,  name: 'Frango c/ Catupiry', price: 25},
    {id: 9,  name: 'Brócolis c/ bacon', price: 25},
    {id: 10,  name: 'Brócolis c/ calabresa', price: 25},
    {id: 11,  name: 'Carne Louca', price: 28},
    {id: 12,  name: 'Carne Louca c/ catupiry', price: 26},
    {id: 13,  name: 'Carne Louca Especial', price: 32},
    {id: 14,  name: 'Frango c/ molho cheddar e bacon', price: 26},
    {id: 15,  name: 'Frango c/ brócolis', price: 26},
    {id: 16,  name: 'Frango c/ creme de milho', price: 27},
    {id: 17,  name: 'Pizza Especial Bacon', price: 27},
    {id: 18,  name: 'Pizza Especial Calabresa', price: 27},
    {id: 19,  name: '4 queijos', price: 30},
    {id: 20,  name: '4 queijos c/ brócolis', price: 33},
    {id: 21,  name: '4 queijos c/ bacon', price: 34},
    {id: 22,  name: '3 queijos', price: 27},
    {id: 23,  name: 'Vegetariana', price: 25},
    {id: 24,  name: 'Caipira', price: 28},
    {id: 25,  name: 'Strogonoff de camarão', price: 30},
    {id: 26,  name: 'Fricassê de frango', price: 25},
    {id: 27,  name: 'Frango ao molho branco e provolone', price: 30},
    {id: 28,  name: 'Frango ao molho branco e bacon', price: 25},
    {id: 29,  name: 'Batata Bolonhesa', price: 25},
    {id: 30,  name: 'Batata Lasanha', price: 25},
    
  ])
  const [clientName, setClientName] = useState('');
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);

  const addToCart = (product) => {
    const item = cart.find((i) => i.id === product.id);

    if (!item) {
      setCart([...cart, { ...product, quantity: 1, total: product.price }]);
    } else {
      const updatedCart = cart.map((i) =>
        i.id === product.id
          ? { ...i, quantity: i.quantity + 1, total: (i.quantity + 1) * product.price }
          : i
      );
      setCart(updatedCart);
      
    }
    updateTotal();

    };
   
  
  console.log(total)


  if (change <= total) {
    Alert.alert('ERRO')
  }
  

  const updateQuantity = (id, quantity) => {
    const updatedCart = cart.map((item) =>
      item.id === id
        ? { ...item, quantity: parseInt(quantity), total: parseInt(quantity) * item.price + selectedAddition + deliveryFee }
        : item
    );
    setCart(updatedCart);
    updateDeliveryFee()

    updateTotal();
  };
  const removeFromCart = (id) => {
    const updatedCart = cart.filter(item => item.id !== id);
    setCart(updatedCart);
    updateTotal();
  };

const updateDeliveryFee = (fee) => {
  setDeliveryFee(fee);
  updateTotal();
};




const [selectedAddition, setSelectedAddition] = useState(0);

const handleAdditionChange = (value) => {
  setSelectedAddition(value);
};


const updateTotal = () => {
  const sum = cart.reduce((acc, item) => acc + item.total, 0);
  const total = sum + deliveryFee;
  setTotal(total)  
  
};
  
  


  useEffect(() => {
    updateTotal();
  }, [cart, selectedAddition]);
  
  
  const [showCart, setShowCart] = useState(false);

const handleCartPress = () => {
  setShowCart(!showCart);
};
  

const [searchTerm, setSearchTerm] = useState('');

const [nomeCliente, setNomeCliente] = useState('');
const [enderecoName, setEndereco] = useState('');
const [deliveryFee, setDeliveryFee] = useState(Number);

const filteredProducts = products.filter(product =>
  product.name.toLowerCase().includes(searchTerm.toLowerCase())
);

const [printTimestamp, setPrintTimestamp] = useState('');

  const handlePrintButtonPress = async  () => {
    const now = new Date();
    const formattedTime = now.toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'});
    setPrintTimestamp(`${formattedTime}`);  
    printReceipt()
    console.log(printTimestamp);
  }


  const printReceipt = async () => {
    if (paymentMethod === 'Dinheiro') {
      try {
        const result = await Print.printAsync({
          html: `
          <img style="text-align:center; margin: 0 auto; width: 60px; display: flex; " src="https://i.imgur.com/rUpt2j9.png">
            <h1 style=" font-size: 14px; margin-top: 44px;">Nome do cliente: ${nomeCliente}
            </h1>
            <span>Horário do pedido: ${printTimestamp}</span>
            <span>.................................................</span>
  
            <table>
              <thead style="display: flex; gap: 20px;">
                      
              </thead>
              <tbody style="gap: 40px">
              <h1 style=" font-size: 16px">Itens do pedido</h1>
                ${cart
                  .map((item) => {
                    return `
                      <tr>
                      <td style="font-size: 13px;">${item.quantity}x  ${item.name} R$${item.price * item.quantity  }
                      
                    </td>                    
                      </tr>
                      
                    `;
                  }
                  )
                  .join('')
                }
                
              </tbody>
          </table>
          </thead>
          
         <span>.................................................</span>
          <h1 style=" font-size: 16px">Informações do endereço</h1>
        <span style="text-align: center; font-size: 12px;">Endereço: ${enderecoName}</span> <br> <br>
        <span style="text-align: center; font-size: 12px;">Forma de pagamento: Dinheiro: troco para R$${change},00.
        <span style="font-size: 12px;">Você deverá dar R$${change - total},00
        de troco</span>
        </span> <br> <br>
        <span style="text-align: center; font-size: 12px;">Taxa de entrega: R$${deliveryFee},00 </span> <br> <br>
  
        <span>.................................................</span>
        <h1 style="text-align:center; font-size: 16px">Informações de pagamento</h1>
        <span style="text-align: center; font-size: 12px;">Valor total do pedido: R$ ${total},00</span>
        <span>.................................................</span>
  
  
        `,
        
        base64: false
      }
      
      );
      
  
  
    } catch (error) {
      console.error(error);
    }
    }else
      try {
      const result = await Print.printAsync({
        html: `
        <img style="text-align:center; margin: 0 auto; width: 60px; display: flex; " src="https://i.imgur.com/rUpt2j9.png">
          <h1 style=" font-size: 14px; margin-top: 44px;">Nome do cliente: ${nomeCliente}
          </h1>
          <span>Data:${printTimestamp}</span>
          <span>.................................................</span>

          <table>
            <thead style="display: flex; gap: 20px;">
                    
            </thead>
            <tbody style="gap: 40px">
            <h1 style=" font-size: 16px">Itens do pedido</h1>
              ${cart
                .map((item) => {
                  return `
                    <tr>
                    <td style="font-size: 13px;">${item.quantity}x  ${item.name} R$${item.price * item.quantity  }
                    
                  </td>                    
                    </tr>
                    
                  `;
                }
                )
                .join('')
              }
              
            </tbody>
        </table>
        </thead>
        
       <span>.................................................</span>
        <h1 style=" font-size: 16px">Informações do endereço</h1>
      <span style="text-align: center; font-size: 12px;">Endereço: ${enderecoName}</span> <br> <br>
      <span style="text-align: center; font-size: 12px;">Forma de pagamento: ${paymentMethod} </span> <br> <br>
      <span style="text-align: center; font-size: 12px;">Taxa de entrega: R$${deliveryFee},00 </span> <br> <br>

      <span>.................................................</span>
      <h1 style="text-align:center; font-size: 16px">Informações de pagamento</h1>
      <span style="text-align: center; font-size: 12px;">Valor total do pedido: R$ ${total},00</span>
      <span>.................................................</span>


      `,
      
      base64: false
    }
    
    );
    


  } catch (error) {
    console.error(error);
  }
};


try {
  GooglePlacesAutocomplete
}catch (error) {
  console.error(error);
  // Lógica de tratamento de erro, por exemplo, exibir uma mensagem para o usuário
}

const GOOGLE_MAPS_API_KEY = 'AIzaSyCdm86e-uX38CsA4I-3_CY-WbHpqLuWvJ4';


  const [selectedValue, setSelectedValue] = useState('null');

  const scrollViewRef = useRef(null);

  const [exibeCard, setExibeCard] = useState('null');

  const scrollToEnd = () => {
    scrollViewRef.current.scrollToEnd({ animated: true });
  };

  const [paymentMethod, setPaymentMethod] = useState('');
  const [change, setChange] = useState(Number);



const handlePaymentMethodChange = (value) => {
  setPaymentMethod(value);
};
const handleClear = () => {
  setNomeCliente('');
  setDeliveryFee(0);
  setCart([]);
  updateTotal();
  setEndereco('')
  //paymentMethod()
};

 handleAddressSelect = (data, details) => {
    const address = details.formatted_address;
    this.setState({ address });
  }


return (
  <View style={styles.container}>
     <View>
    <TouchableOpacity onPress={handleCartPress}>
      <Image style={styles.menu} source={require('./assets/menu.png')} />
      
    </TouchableOpacity>
    {showCart && (
            <ScrollView  ref={scrollViewRef}      style={[styles.cartContainer, { height: showCart ? '100%' : 0, width: showCart ? '100%' : 0 }]}>
          <View style={styles.dadoscliente}>
          <Image style={styles.logocard}
    source={require('./assets/logo.png')}
    />
              <Text style={styles.headerfiscal}>Nota fiscal e carrinho</Text>
             
              <TextInput
        style={styles.inputpesquisa}
        placeholder="Nome do cliente"
        onChangeText={text => setNomeCliente(text)}
        value={nomeCliente}
      />
     <ScrollView style={{width: '100%'}}>
     <GooglePlacesAutocomplete 
    placeholder='Buscar endereço'
    onPress={(data, details = null) => {
      // 'details' is provided when fetchDetails = true
      console.log(data, details);
      
    }}
    query={{
      key: GOOGLE_MAPS_API_KEY,
      language: 'pt-br',
    }}
    styles={{
      textInputContainer: {
        width: '100%',
        borderRadius: 40,
        
      },
      description: {
        fontWeight: 'bold',
      },
      predefinedPlacesDescription: {
        color: '#1faadb',
      },
      textInput: {
        backgroundColor: '#F2F2F2',
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginVertical: 10,
        height: 50,
        
      }
    }}
      />

     </ScrollView>
     
      <TextInput 
      style={styles.inputpesquisa}
      value={deliveryFee}
      onChangeText={setDeliveryFee}
      keyboardType="numeric"
      placeholder="Valor da entrega"
      />

<Picker
  selectedValue={paymentMethod}
  onValueChange={(itemValue) => setPaymentMethod(itemValue)}
  style={{
    backgroundColor: '#F2F2F2',
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginVertical: 10,
    height: 50,
  }}
>

  <Picker.Item label='Selecionar sua forma de pagamento' value={null} />
  <Picker.Item label="Dinheiro" value="Dinheiro" />
  <Picker.Item label="Cartão de crédito" value="Cartão de crédito" />
  <Picker.Item label="Pix" value="Pago via pix" />
</Picker>
{paymentMethod === 'Dinheiro' && (
  <TextInput
    onChangeText={(text) => setChange(text)}
    value={change}
    style={styles.inputpesquisa}
    placeholder="Quantidade de troco"
  />
 
)

}


            </View>
            <View style={styles.carrinhoCartao}>
            <Image style={styles.logocard}
    source={require('./assets/logo.png')}
    />
        <Text style={styles.clientenametext}>Nome do cliente: {nomeCliente}</Text>
        <Text style={styles.clientenametext}>-------------------------------</Text>
        <Text style={styles.clientenametext}>Itens do pedido</Text>
        <Text style={styles.clientenametext}>-------------------------------</Text>
        
        {cart.map((item) => (
          <View style={styles.cartItem} key={item.id}>
            <View style={styles.cartItemDetails}>
              <Text style={styles.cartItemName}>{item.name}</Text>
              <Text style={styles.cartItemPrice}>R$ {item.price * item.quantity}, 00</Text>
              <Picker
    selectedValue={selectedAddition}
    onValueChange={handleAdditionChange}
  >
    <Picker.Item label="Sem acréscimo" value={0} />
    <Picker.Item label="Acréscimo de R$ 5,00" value={5} />
    <Picker.Item label="Acréscimo de R$ 10,00" value={10}  />
  </Picker>
            </View>
            <View style={styles.cartItemQuantity}>
              <TextInput
                style={styles.cartItemQuantityInput}
                keyboardType="number-pad"
                value={item.quantity.toString()}
                onChangeText={(quantity) => updateQuantity(item.id, quantity)}
              />
            </View>
            <TouchableOpacity style={styles.removeButton} onPress={() => removeFromCart(item.id)}>
              
              <Text style={styles.removeButtonText}>Remover</Text>
            </TouchableOpacity>
          </View>
        ))}
                <Text style={styles.clientenametext}>Informações de endereço</Text>
                <Text style={styles.clientenametext}>-------------------------------</Text>
                <Text style={styles.clientenametext}>{enderecoName}</Text>
                <Text style={styles.clientenametext}>{paymentMethod}</Text>
                <Text style={styles.clientenametext}>Valor total: R$ {total},00</Text>

        {cart.length > 0 && (
          <ScrollView  style={[styles.cartContainer, { height: showCart ? '100%' : 0, width: showCart ? '100%' : 0 }]}>
            <TouchableOpacity style={styles.printButton} onPress={handlePrintButtonPress }>
              <Text style={styles.printButtonText}>Imprimir</Text>
              
            </TouchableOpacity>
            <TouchableOpacity style={styles.printButton} onPress={handleClear}>
              <Text style={styles.printButtonText}>Limpar carrinho</Text>
              
            </TouchableOpacity>
            <View>
                <Text>   </Text>
                <Text>   </Text><Text>  
                   </Text><Text>  
                     </Text><Text>  
                       </Text>
              </View>
          </ScrollView>

        )}
         </View> 

      </ScrollView>
    )}
  </View>
   <ScrollView showsVerticalScrollIndicator={false}>
   <Image style={styles.logotopo}
    source={require('./assets/logo.png')}
    />
    <Text style={styles.texttopo}>Gestor de pedidos</Text>
    <View style={styles.searchContainer}>
    <View>   


  </View>
  
</View>
<TextInput
        style={styles.inputpesquisa}
        placeholder="Pesquise aqui"
        onChangeText={text => setSearchTerm(text)}
        value={searchTerm}
      />
      <Text style={styles.header}>Itens da loja</Text>
    <ScrollView horizontal style={styles.productsContainer}>
        {filteredProducts.map(product => (
        <View style={styles.productCard} key={product.id}>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productPrice}>R$ {product.price},00</Text>
          <TouchableOpacity style={styles.addButton} onPress={() => addToCart(product)}>
            <Text style={styles.addButtonText}>Adicionar</Text>
          </TouchableOpacity>
        </View>
      ))}
   </ScrollView>

   </ScrollView>

  </View>

      
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  textocliente: {
    fontSize: 17,
  },
  logocard: {
    textAlign: 'center',
    justifyContent: 'center',
    width: 100, height: 100, alignSelf: 'center',
    marginTop: 15
  },
  clientenametext: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 20,
    fontWeight: 'bold'
  },

  headerfiscal: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 20
  },
  containermain: {
    flex: 1
  },
  carrinhoCartao: {
    width: '100%',
    padding: 0,
    height: '100%',
    borderRadius: 40,
    backgroundColor: 'white',
    shadowColor: 'rgba(0, 0, 0, 3)',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 1,
  shadowRadius: 4,
  elevation: 4,

  },
  containerff: {
    width: '100%'
  },
  containermenu: {
    backgroundColor: 'black'
  },
  menu: {
    alignContent: 'flex-end',
    display: 'flex',
    alignItems: 'flex-end',
    marginTop: 50,
    marginLeft: 420,    
  },
  description: {
    fontSize: 17,
    fontWeight: 'bold',
    marginVertical: 20,
    marginBottom: 50
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
    padding: 12,
  },
  header2: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
    padding: 14,
    marginTop: 20

  },
  input: {
    height: 40,
    marginVertical: 10,
    paddingHorizontal: 10,
    borderColor: 'gray',
    borderWidth: 1,
  },
  productsContainer: {
    height: 120,
  },
  productCard: {
    width: 220,
    height: 100,
    backgroundColor: '#D9D9D9',
    marginRight: 20,
    padding: 20,
    borderRadius: 25,
    alignItems: 'center',
    borderColor: '#000000',
    borderWidth: 1,
  },
  searchContainer: {
    backgroundColor: '#F2F2F2',
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginVertical: 10,
  },
  inputpesquisa: {
    backgroundColor: '#F2F2F2',
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginVertical: 10,
    height: 50,
    
  },
  icon: {
    width: 20,
    height: 20,
    tintColor: '#A6A6A6',
    marginRight: 10,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  productPrice: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  texttopo: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 30,
    marginTop: 50
  },
  addButton: {
    backgroundColor: '#FF0000',
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginTop: 20,
    width: 130,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center'
  },
  cartContainer: {
    marginTop: 0,
    padding: 0
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: 'ffff',
    padding: 12,
    marginTop: 20,
    fontWeight: 'bold',
    borderRadius: 30

  },
  cartItemDetails: {
    flex: 1,
  },
  cartItemName: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  cartItemPrice: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  cartItemQuantity: {
    width: 100,
    alignItems: 'center'
  },
  cartItemQuantityInput: {
    borderWidth: 1,
    borderColor: '#333',
    padding: 10,
    width: 50,
    borderRadius: 20,
    textAlign: 'center'
  },
  removeButton: {
    backgroundColor: '#333',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    textAlign: 'center',
    justifyContent: 'center'
  },
  removeButtonText: {
    color: '#fff',
    fontWeight: 'bold'
  },
  actions: {
    flexDirection: 'row',
    marginTop: 20
  },
  printButton: {
    backgroundColor: '#FF0000',
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderRadius: 20,
    flex: 1,
    marginRight: 20,
    marginTop: 20,
  },
  printButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
    backgroundColor: '#FF0000'
  },
  shareButton: {
    backgroundColor: '#333',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    flex: 1
  },
  searchContainer: {
    padding: 10,
  },
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
  },
  logotopo: {
    textAlign: 'center',
    justifyContent: 'center',
    width: 120, height: 120, alignSelf: 'center',
    marginTop: 50
  },
  shareButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center'
  }})

export default App
