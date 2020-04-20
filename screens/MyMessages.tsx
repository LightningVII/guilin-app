import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  RefreshControl,
  Alert,
  AsyncStorage,
  Text,
  Dimensions,
  Platform,
} from "react-native";
import { connect } from "react-redux";
import ViewLoading from "../layouts/ViewLoading";
import * as Actions from "../redux/remoteSensingActions.js";
import {
  Button,
  Header,
  Overlay,
  ListItem,
  colors,
} from "react-native-elements";
import { AntDesign, FontAwesome5 } from "@expo/vector-icons";
import moment from "moment";

const { width } = Dimensions.get("window");

function Home(props) {
  const { navigation, fetchChangespotList, remoteSensing, user } = props;
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [overlayStatus, setOverlayStatus] = useState(false);
  const [pageNum, setPageNum] = useState(1);
  const [loading, setLoading] = useState(false);
  const { remoteSensingList: list } = remoteSensing || {};
  const { userid } = user?.user || {};

  const fetchParams = {
    userid,
    pageNum,
    pageSize: 200,
    term: search,
  };

  /* useEffect(() => {
    setLoading(true);
    const btns = [{ text: "知道了", onPress: () => setLoading(false) }];
    fetchChangespotList(fetchParams).then(res => {
      if (res?.error) Alert.alert("警告", "服务器网络异常", btns);
      else setLoading(false);
    });
  }, [userid]); */

  const updateSearch = (search) => setSearch(search);

  const _onRefresh = () => {
    setRefreshing(true);
    // setPageNum(pageNum + 1);
    fetchChangespotList(fetchParams).then(() => setRefreshing(false));
  };

  const renderItem = ({ item }) => (
    <ListItem
      onPress={() => setOverlayStatus(true)}
      title={item.county}
      subtitle={
        <Text numberOfLines={1} ellipsizeMode="head">
          徐州徐州徐州徐州徐州徐州徐州徐州
        </Text>
      }
      rightElement={<Text>{item.location}</Text>}
      bottomDivider
    />
  );

  return (
    <ViewLoading
      loading={loading}
      style={{ flex: 1, backgroundColor: colors.grey5 }}
    >
      <View style={{ flex: 1 }}>
        <FlatList
          keyExtractor={({ spotid }) => spotid}
          data={[
            {
              county: "徐州",
              location: moment().format("MM-DD hh:mm"),
              spotid: "a",
              qsxbhdl: "絮絮",
            },
          ]} // list
          renderItem={renderItem}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={_onRefresh} />
          }
        />
      </View>
      <Overlay
        fullScreen
        isVisible={overlayStatus}
        overlayStyle={{ padding: 0 }}
        // onBackdropPress={() => setOverlayStatus(false)}
      >
        <View>
          <Header
            rightComponent={{
              icon: "close",
              color: "black",
              onPress: () => setOverlayStatus(false),
            }}
            centerComponent={{ text: "My Message Title" }}
            containerStyle={{
              backgroundColor: "white",
              justifyContent: "space-around",
              marginTop: Platform.OS === "ios" ? 0 : -22,
            }}
          />
          {/* <Button title={'asd'} onPress={() => setOverlayStatus(false)} /> */}
          <Text style={{ padding: 20 }}>Hello from Overlay!</Text>
        </View>
      </Overlay>
    </ViewLoading>
  );
}

export default connect(
  ({ remoteSensing, user }) => ({ remoteSensing, user }),
  Actions
)(Home);
