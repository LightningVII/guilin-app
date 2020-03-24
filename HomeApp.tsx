import React, { useState, useEffect } from "react";
import { AsyncStorage } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { AntDesign } from "@expo/vector-icons";
import RemoteSensingTaskList from "./screens/RemoteSensingTaskList";
import RemoteSensingTaskDetail from "./screens/RemoteSensingTaskDetail";
import FeedbackForm from "./screens/FeedbackForm";
import ImagesPicker from "./screens/ImagesPicker";
import Login from "./screens/Login";
import { connect } from "react-redux";
import * as Actions from "./redux/userActions.js";

const Stack = createStackNavigator();

const options = ({ navigation }) => ({
  headerTitle: "我的任务",
  headerRight: () => (
    <AntDesign
      onPress={async () => {
        await AsyncStorage.removeItem("userid");
        navigation.canGoBack()
          ? navigation.goBack()
          : navigation.navigate("Login");
      }}
      name={"logout"}
      size={20}
      style={{ marginRight: 20 }}
    />
  )
});

export default connect(
  () => ({}),
  Actions
)(props => {
  const [isReady, setIsReady] = useState(false);
  const [initialRouteName, setInitialRouteName] = useState("Login");

  useEffect(() => {
    (async function() {
      const { fetchMe } = props;
      const userid = await AsyncStorage.getItem("userid");
      if (userid) {
        await fetchMe(userid);
        setInitialRouteName("RemoteSensingTaskList");
      }

      setIsReady(true);
    })();
  }, []);
  if (!isReady) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRouteName}>
        <Stack.Screen
          name="RemoteSensingTaskList"
          options={options}
          component={RemoteSensingTaskList}
        />
        <Stack.Screen
          name="RemoteSensingTaskDetail"
          component={RemoteSensingTaskDetail}
        />
        <Stack.Screen name="FeedbackForm" component={FeedbackForm} />
        <Stack.Screen name="ImagesPicker" component={ImagesPicker} />
        <Stack.Screen
          name="Login"
          options={{ headerShown: false }}
          component={Login}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
});
