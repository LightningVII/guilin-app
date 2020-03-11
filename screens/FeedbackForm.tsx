import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  SafeAreaView,
  TextInput,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Picker
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { TextareaItem } from "@ant-design/react-native";
import moment from "moment";
import {
  Button,
  Input,
  CheckBox,
  Overlay,
  ListItem,
  Image,
  colors
} from "react-native-elements";
import { AntDesign } from "@expo/vector-icons";
import { useActionSheet } from "@expo/react-native-action-sheet";
import * as ImagePicker from "expo-image-picker";
import PicturePreview from "../components/PicturePreview";
import { connect } from "react-redux";
import * as Actions from "../redux/remoteSensingActions.js";

const styles = {
  checkBox: {
    marginTop: 20,
    marginBottom: 20,
    marginLeft: 0,
    marginRight: 0,
    backgroundColor: "#FFF",
    borderWidth: 0,
    borderRadius: 0
  },
  input: {
    marginBottom: 0,
    backgroundColor: "#FFF",
    marginTop: 20,
    paddingTop: 20,
    paddingBottom: 20
  }
};

function FeedbackForm(props) {
  const {
    navigation,
    route,
    user,
    fetchChangespotImplement,
    fetchChangespotUpload
  } = props;
  // const [isIllegal, setIsIllegal] = useState(true);
  const [selectedImages, setSelectedImages] = useState([]);
  const [cameraImages, setCameraImages] = useState([]);
  const [content, setContent] = useState();
  const [remark, setRemark] = useState();
  const { showActionSheetWithOptions } = useActionSheet();
  const [isVisible, setIsVisible] = useState(false);
  const [source, setSource] = useState();
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setDate(currentDate);
  };

  const params = {
    tbbm: route?.params?.tbbm,
    czsj: moment(date).format("YYYY-MM-DD"),
    czry: user?.user?.userid,
    czyj: content,
    // fj: "",
    remark
  };

  useEffect(() => {
    if (route?.params?.type === "update") {
      setContent("111");
      // setIsIllegal(true);
      setSelectedImages([
        {
          id: "B84E8479-475C-4727-A4A4-B77AA9980897/L0/001",
          filename: "IMG_0002.JPG",
          localUri:
            "file:///Users/Ace/Library/Developer/CoreSimulator/Devices/1C32C990-EF2C-4212-BE5C-547F8BC2816D/data/Media/DCIM/100APPLE/IMG_0002.JPG",
          mediaType: "photo"
        }
      ]);
    }
  }, []);

  navigation.setOptions({
    headerTitle: "请填写执行报告"
  });

  const imagesPicker = () =>
    navigation.navigate("ImagesPicker", {
      callback: data =>
        setSelectedImages(
          data?.photos.map(p => ({
            id: p.id,
            filename: p.filename,
            localUri: p.localUri,
            uri: p.uri,
            mediaType: p.mediaType
          })) || []
        ),
      max: 9 - cameraImages.length,
      selected: selectedImages
    });
  const cancel = () => console.log("cancel :");
  const camera = async () => {
    const permissionResult = await ImagePicker.requestCameraRollPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("需要访问相机胶卷的权限!");
      return;
    }

    const pickerResult = await ImagePicker.launchCameraAsync();
    if (pickerResult.cancelled === true) return;
    console.log("pickerResult :", pickerResult);
    setCameraImages([...cameraImages, { localUri: pickerResult.uri }]);
  };

  const actions = [camera, imagesPicker, cancel];

  const showActionSheet = () => {
    const BUTTONS = ["拍照", "从相册选择", "取消"];
    showActionSheetWithOptions(
      {
        options: BUTTONS,
        cancelButtonIndex: 2
      },
      buttonIndex => {
        console.log("object --------:", BUTTONS[buttonIndex]);
        actions[buttonIndex]();
      }
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF" }}>
      <View style={{ flex: 1, backgroundColor: colors.grey5 }}>
        <Input
          value={content}
          onChange={e => setContent(e?.nativeEvent?.text)}
          // ref={component => (this._textInput = component)}
          containerStyle={styles.input}
          inputContainerStyle={{ borderBottomWidth: 0 }}
          label={"填写执行信息"}
          // placeholder="填写执行信息"
          multiline
        />

        <Input
          value={remark}
          onChange={e => setRemark(e?.nativeEvent?.text)}
          // ref={component => (this._textInput = component)}
          containerStyle={styles.input}
          inputContainerStyle={{ borderBottomWidth: 0 }}
          label={"备注"}
          // placeholder="填写执行信息"
          multiline
        />

        <ListItem
          style={{ marginTop: 20, marginBottom: 20 }}
          title="执行日期"
          onPress={showActionSheet}
          rightIcon={
            <Button
              buttonStyle={{ paddingTop: 0, paddingBottom: 0 }}
              type="clear"
              onPress={() => setShow(true)}
              title={moment(date).format("YYYY-MM-DD")}
            />
          }
          bottomDivider
        />
        {/* <CheckBox
          containerStyle={styles.checkBox}
          title={isIllegal ? "违规" : "合法"}
          iconType="material"
          checkedIcon="clear"
          uncheckedIcon="check"
          checkedColor="red"
          uncheckedColor="green"
          checked={isIllegal}
          onPress={() => setIsIllegal(!isIllegal)}
        /> */}

        <ListItem
          title={"图片"}
          onPress={showActionSheet}
          rightIcon={<AntDesign name={"picture"} size={20} color={"#2089dc"} />}
          bottomDivider
        />
        <ListItem
          title={"附件"}
          onPress={() => {}}
          rightIcon={
            <AntDesign name={"paperclip"} size={20} color={"#2089dc"} />
          }
        />

        {selectedImages?.length || cameraImages?.length ? (
          <View
            style={{
              flexDirection: "row",
              padding: 10,
              backgroundColor: "#FFF",
              marginTop: 20,
              flexWrap: "wrap"
            }}
          >
            {[...cameraImages, ...selectedImages].map(image => (
              <TouchableWithoutFeedback
                key={image.id}
                onPress={() => {
                  setIsVisible(true);
                  setSource({ uri: image.localUri });
                }}
              >
                <Image
                  key={image.localUri}
                  source={{ uri: image.localUri }}
                  containerStyle={{
                    marginRight: 4,
                    width: 80,
                    height: 80
                  }}
                  PlaceholderContent={<ActivityIndicator />}
                />
              </TouchableWithoutFeedback>
            ))}
          </View>
        ) : null}
        <PicturePreview
          handleBackdropPress={() => setIsVisible(false)}
          isVisible={isVisible}
          source={source}
        />

        <Overlay
          isVisible={show}
          height="auto"
          onBackdropPress={() => setShow(false)}
        >
          <DateTimePicker
            testID="dateTimePicker"
            timeZoneOffsetInMinutes={0}
            value={date}
            mode="date"
            is24Hour={true}
            locale="zh-CN"
            display="default"
            onChange={onChange}
          />
        </Overlay>
      </View>
      <View style={{ padding: 10 }}>
        <Button
          buttonStyle={{ backgroundColor: colors.warning }}
          onPress={async () => {
            const fj = await fetchChangespotUpload([
              ...cameraImages,
              ...selectedImages
            ]);
            const data = await fetchChangespotImplement({
              ...params,
              fj: fj?.content
            });
            navigation.goBack();
          }}
          title="提交执行"
        />
      </View>

      {/* <TextareaItem rows={4} placeholder="请填写内容" /> */}
      {/* <Button onPress={() => navigation.goBack()} title="Go back home" /> */}
    </SafeAreaView>
  );
}

export default connect(
  ({ remoteSensing, user }) => ({ remoteSensing, user }),
  Actions
)(FeedbackForm);
