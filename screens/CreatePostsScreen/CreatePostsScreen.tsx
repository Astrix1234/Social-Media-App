import React, { useLayoutEffect, useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { styles } from "./CreatePostsScreen.styles";
import { Ionicons } from "@expo/vector-icons";
import { useFormik } from "formik";
import { validationSchema } from "./validationSchema";
import { FontAwesome6, MaterialIcons } from "@expo/vector-icons";
import { Camera, CameraType } from "expo-camera";
import { RootStackParamList } from "../../components/AppNavigator";
import { StackNavigationProp } from "@react-navigation/stack";
import { useAppContext } from "../../components/AppContextProvider";
import { Loader } from "../../components/Loader";

export const CreatePostsScreen = () => {
  const navigation = useNavigation();
  const navigationMap =
    useNavigation<StackNavigationProp<RootStackParamList, "Map">>();
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const cameraRef = useRef<Camera>(null);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const { location, fetchAddress, addPostForUser, userId, userData } =
    useAppContext();

  if (!userId) {
    return <Loader />;
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons
            name="arrow-back"
            size={24}
            color="#212121"
            style={{ marginLeft: 16 }}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const formik = useFormik({
    initialValues: {
      photo: "",
      profilePicture: userData[0]?.profilePicture || "",
      login: userData[0].login,
      title: "",
      location: "",
      likes: 0,
      commentsNumber: 0,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      if (typeof userId === "string") {
        console.log(values);
        handlePublishPost(
          userId,
          values.photo,
          values.profilePicture,
          values.login,
          values.title,
          values.location,
          values.likes,
          values.commentsNumber
        );
        // console.log("Post published", values);
        handleClear();
        navigation.goBack();
      }
    },
  });

  useEffect(() => {
    if (location) {
      const setAddressField = async () => {
        const address = await fetchAddress(
          location.latitude,
          location.longitude
        );
        if (address) {
          formik.setFieldValue("location", address);
        }
      };
      setAddressField();
    }
  }, [location]);

  const handleFocus = (name: string) => {
    setFocusedField(name);
  };

  useEffect(() => {
    (async () => {
      if (!permission?.granted) {
        await requestPermission();
      }
    })();
  }, []);

  if (!permission) {
    return (
      <View>
        <Text>Please await the camera rights...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View>
        <Text>No camera rights.</Text>
      </View>
    );
  }

  function toggleCameraType() {
    setType((current) =>
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const pictureResult = await cameraRef.current.takePictureAsync();
        setPhotoUri(pictureResult.uri);
        formik.setFieldValue("photo", pictureResult.uri);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleClear = () => {
    setPhotoUri(null);
    formik.resetForm();
  };

  const handlePublishPost = async (
    userId: string | null,
    imageUri: string,
    profilePicture: string,
    login: string,
    title: string,
    location: string,
    likes: number,
    commentsNumber: number
  ) => {
    if (userId === null) {
      console.error("userId is null");
      return;
    }
    try {
      await addPostForUser(
        userId,
        imageUri,
        profilePicture,
        login,
        title,
        location,
        likes,
        commentsNumber
      );
      // console.log("Post published");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 80 }}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ flexGrow: 1 }}>
            <View style={styles.postContainer}>
              {photoUri ? (
                <View style={styles.imageContainer}>
                  <Image source={{ uri: photoUri }} style={styles.camera} />
                </View>
              ) : (
                <View style={styles.imageContainer}>
                  <Camera ref={cameraRef} style={styles.camera} type={type}>
                    <TouchableOpacity
                      style={styles.cameraButton}
                      onPress={takePicture}
                    >
                      <MaterialIcons
                        name="photo-camera"
                        size={30}
                        color="white"
                      />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={toggleCameraType}>
                      <Text style={styles.toogleCameraText}>Flip Camera</Text>
                    </TouchableOpacity>
                  </Camera>
                </View>
              )}
              <TouchableOpacity onPress={() => setPhotoUri(null)}>
                <Text style={styles.editPhoto}>Edit photo</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.inputsContainer}>
              <View style={styles.inputContainer}>
                <TextInput
                  style={[
                    styles.input,
                    focusedField === "title" && styles.focused,
                    formik.touched.title && formik.errors.title
                      ? styles.error
                      : {},
                  ]}
                  id="title"
                  placeholderTextColor="#BDBDBD"
                  placeholder="Name..."
                  value={formik.values.title}
                  onChangeText={formik.handleChange("title")}
                  onBlur={formik.handleBlur("title")}
                  onFocus={() => handleFocus("title")}
                />
                {formik.touched.title && formik.errors.title && (
                  <Text style={styles.errorText}>{formik.errors.title}</Text>
                )}
              </View>
              <View style={styles.inputContainer}>
                <TextInput
                  style={[
                    styles.input,
                    focusedField === "location" && styles.focused,
                    formik.touched.location && formik.errors.location
                      ? styles.error
                      : {},
                    { paddingLeft: 28 },
                  ]}
                  id="location"
                  placeholderTextColor="#BDBDBD"
                  placeholder="Location..."
                  value={formik.values.location}
                  onChangeText={formik.handleChange("location")}
                  onBlur={formik.handleBlur("location")}
                  onFocus={() => handleFocus("location")}
                  editable={false}
                />
                {formik.touched.location && formik.errors.location && (
                  <Text style={styles.errorText}>{formik.errors.location}</Text>
                )}
                <TouchableOpacity
                  style={styles.btnLocation}
                  onPress={() =>
                    navigationMap.navigate("Map", {
                      onLocationSelect: (locationString: string) => {
                        console.log(locationString);
                      },
                    })
                  }
                >
                  <FontAwesome6 name="location-dot" size={24} color="#BDBDBD" />
                </TouchableOpacity>
              </View>
              <View style={styles.btnContainer}>
                <TouchableOpacity
                  style={[
                    styles.btn,
                    !(formik.isValid && formik.dirty) && styles.disabledBtn,
                  ]}
                  onPress={() => formik.handleSubmit()}
                  disabled={!(formik.isValid && formik.dirty)}
                >
                  <Text style={styles.btnText}>Publish</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.btnContainer}>
                <TouchableOpacity style={styles.btnClear} onPress={handleClear}>
                  <Text style={styles.btnText}>Clear</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
