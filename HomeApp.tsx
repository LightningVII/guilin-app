import * as React from "react";
import { Button, Text, View } from "react-native";
import { NavigationNativeContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { AntDesign } from "@expo/vector-icons";
import { Avatar, Badge, Icon, withBadge } from "react-native-elements";
import RemoteSensingTaskList from "./screens/RemoteSensingTaskList";
import RemoteSensingTaskDetail from "./screens/RemoteSensingTaskDetail";
import FeedbackForm from "./screens/FeedbackForm";
import ImagesPicker from "./screens/ImagesPicker";
import Login from "./screens/Login";

const Stack = createStackNavigator();
const BadgedIcon = withBadge()(Icon);

const options = {
  headerTitle: "我的任务",
  headerRight: props => (
    <AntDesign name={"search1"} size={20} style={{ marginRight: 20 }} />
  ),
  headerLeft: props => (
    <BadgedIcon
      type="antdesign"
      name="bells"
      size={20}
      containerStyle={{ marginLeft: 20 }}
    />
  )
};

export default () => {
  let initialRouteName = 1 ? "Login" : "RemoteSensingTaskList";

  return (
    <NavigationNativeContainer>
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
    </NavigationNativeContainer>
  );
};
