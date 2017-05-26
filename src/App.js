import React, { Component } from 'react';
import {Text, View, TextInput} from 'react-native'
import logo from './logo.svg';
import './App.css';


const isAndroid = /Android/i.test(navigator && navigator.userAgent)

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      phone: '',
    }
  }

  handleAndroid(){
    console.log('handling android in component');
    console.log(isAndroid);
    let inputLength = this.textInput ? this.textInput.props.value.length : 0;
    console.log(inputLength);
    let offSet;
    if(inputLength<3){
      offSet = inputLength+3
    }
    if(inputLength>=3 && inputLength<8){
      offSet = inputLength+4
    }
    if(inputLength>=8){
      offSet = inputLength+6
    }
    if(isAndroid){
      let selection={start :this.textInput ? offSet : 0, end: this.textInput ? offSet : 0}
      return selection
    }
    return null;
  }

  render() {

    let placeholderText = `Enter your mobile '#'`
    return (
      <View style={{
        alignSelf: 'flex-start',
        backgroundColor: 'hsla(0, 0%, 13%, 0.9)',
        borderRadius: 10,
        paddingVertical: 40,
        width: undefined,
      }}>
        <TextInput
          autoCorrect={false}
          placeholder={placeholderText}
          style={{
            backgroundColor: '#fff',
            borderColor: '#979797',
            borderRadius: 3,
            borderWidth: 1,
            fontSize: 18,
            fontWeight: '300',
            height: 42,
            marginHorizontal: 38,
            marginTop: 41,
            paddingLeft: 75,
          }}
          value={this.state.phone}
          ref={(input) => {
            // Enable autofocus on all but the smallest screens
              this.textInput = input
          }}
          selection={this.handleAndroid()}
          onChangeText={(newText) => {
            // Add area code opening parenthese
            if (this.state.phone === '') {
              console.log(this.textInput.props.value.length)
              console.log(this.textInput.props.value)
              console.log('is selection perpetually undefined on android?')
              console.log(this.textInput.props.selection)
              return this.setState({ phone: `(${newText}` })
            }

            // Add area code closing parenthese
            if (this.state.phone.length === 3 && newText.length === 4) {
              console.log(this.textInput.props.value.length)
              console.log(this.textInput.props.value)
              console.log(this.textInput.props.selection)
              return this.setState({ phone: `${newText}) ` })
            }

            // Split final four digits
            if (this.state.phone.length === 8 && newText.length === 9) {
              return this.setState({ phone: `${newText} - ` })
            }

            // Backspace final four digits separator
            if (this.state.phone.length === 12 && newText.length === 11) {
              return this.setState({ phone: this.state.phone.slice(0, 8) })
            }

            // Backspace area code closing parenthese
            if (this.state.phone.length === 6 && newText.length === 5) {
              return this.setState({ phone: this.state.phone.slice(0, 3) })
            }

            // Backspace area code opening parenthese
            if (this.state.phone.length === 2 && newText.length === 1) {
              return this.setState({ phone: '' })
            }

            // When done
            if (newText.length === 16) {
              // Remove all but digits
              const phoneNumber = newText.split('')
                .filter(character => '0123456789'.indexOf(character) > -1)
                .join('')

              // Special code to demo registration
              if (phoneNumber === '5555551776') {
                //dispatch({ type: 'START_REGISTRATION_DEMO' })
                //return history.replace('registration')
              }

              // Special code to demo login
              if (phoneNumber === '0000001776') {
                this.setState({ phone: newText })
                return fetch('https://api.liquid.vote/login/demo', {
                  headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
                  method: 'POST',
                })
                .then(response => response.json())
                .then(({ sessionId, user }) => {
                  //dispatch({ sessionId, type: 'START_LOGIN_DEMO', user })
                  //return history.replace('sf')
                })
              }

              // Check if this is a new number
              if (!this.props.knownNumbers[phoneNumber]) {
                this.setState({ phone: newText })
                //return history.push(`confirm-new-number/${phoneNumber}`)
              }

              fetch('https://api.liquid.vote/login', {
                body: JSON.stringify({
                  phone: phoneNumber,
                }),
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                },
                method: 'POST',
              })

              //dispatch({ phoneNumber, type: 'SET_PHONE_NUMBER' })
              //history.replace('enter-sms')
            }

            // Otherwise, update backing state normally
            return this.setState({ phone: newText })
          }}
      />
      </View>
    );
  }
}

export default App;
