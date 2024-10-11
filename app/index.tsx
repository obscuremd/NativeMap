import { Redirect } from 'expo-router'
import React from 'react'
import { Text } from 'react-native'

const RootScreen = () => {
  return <Redirect href='/(home)'/>
}

export default RootScreen