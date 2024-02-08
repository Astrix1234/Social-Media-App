import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { styles } from "./RegistrationScreen.styles";
import { useFormik } from "formik";
import { validationSchema } from "./validationSchema";
import { RootStackParamList } from "../../components/AppNavigator";
import { StackNavigationProp } from "@react-navigation/stack";
import * as ImagePicker from "expo-image-picker";

type loginScreenProp = StackNavigationProp<RootStackParamList, "Login">;

export const RegistrationScreen = () => {
  const navigation = useNavigation<loginScreenProp>();

  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [passwordShown, setPasswordShown] = useState(false);
  const [image, setImage] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: {
      login: "",
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      console.log(values);
    },
  });

  const handleFocus = (name: string) => {
    setFocusedField(name);
  };

  const togglePasswordVisibility = () => {
    setPasswordShown(!passwordShown);
  };

  const handleRegistration = () => {
    navigation.navigate("Home");
    console.log("Pressed");
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ImageBackground
        source={require("../../assets/images/Photo BG.png")}
        style={styles.backgroundImage}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.container}>
              <View style={styles.photoContainer}>
                {image && (
                  <Image
                    source={{ uri: image }}
                    style={{ width: 120, height: 120 }}
                  />
                )}
              </View>
              <TouchableOpacity style={styles.btnAddPhoto} onPress={pickImage}>
                <Text style={styles.btnAddPhotoText}>+</Text>
              </TouchableOpacity>
              <Text style={styles.title}>Registration</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={[
                    styles.input,
                    focusedField === "login" && styles.focused,
                    formik.touched.login && formik.errors.login
                      ? styles.error
                      : {},
                  ]}
                  id="login"
                  placeholderTextColor="#BDBDBD"
                  placeholder="Login"
                  autoComplete="name"
                  value={formik.values.login}
                  onChangeText={formik.handleChange("login")}
                  onBlur={formik.handleBlur("login")}
                  onFocus={() => handleFocus("login")}
                />
                {formik.touched.login && formik.errors.login && (
                  <Text style={styles.errorText}>{formik.errors.login}</Text>
                )}
              </View>
              <View style={styles.inputContainer}>
                <TextInput
                  style={[
                    styles.input,
                    focusedField === "email" && styles.focused,
                    formik.touched.email && formik.errors.email
                      ? styles.error
                      : {},
                  ]}
                  id="email"
                  placeholderTextColor="#BDBDBD"
                  placeholder="Email"
                  autoComplete="email"
                  value={formik.values.email}
                  onChangeText={formik.handleChange("email")}
                  onBlur={formik.handleBlur("email")}
                  onFocus={() => handleFocus("email")}
                />
                {formik.touched.email && formik.errors.email && (
                  <Text style={styles.errorText}>{formik.errors.email}</Text>
                )}
              </View>
              <View style={styles.inputContainer}>
                <TextInput
                  style={[
                    styles.input,
                    focusedField === "password" && styles.focused,
                    formik.touched.password && formik.errors.password
                      ? styles.error
                      : {},
                  ]}
                  id="password"
                  placeholder="Password"
                  placeholderTextColor="#BDBDBD"
                  secureTextEntry={!passwordShown}
                  value={formik.values.password}
                  onChangeText={formik.handleChange("password")}
                  onBlur={formik.handleBlur("password")}
                  onFocus={() => handleFocus("password")}
                />
                {formik.touched.password && formik.errors.password && (
                  <Text style={styles.errorText}>{formik.errors.password}</Text>
                )}
                <TouchableOpacity
                  style={styles.btnShowPassword}
                  onPress={togglePasswordVisibility}
                >
                  <Text style={styles.btnTextShowPassword}>
                    {passwordShown ? "Hide" : "Show"}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.btnContainer}>
                <TouchableOpacity
                  style={[
                    styles.btn,
                    !(formik.isValid && formik.dirty) && styles.disabledBtn,
                  ]}
                  onPress={handleRegistration}
                  disabled={!(formik.isValid && formik.dirty)}
                >
                  <Text style={styles.btnText}>Registration</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.btnSignInContainer}>
                <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                  <Text style={styles.btnSignInText}>
                    Already have an account? Sign in
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </ImageBackground>
    </TouchableWithoutFeedback>
  );
};
