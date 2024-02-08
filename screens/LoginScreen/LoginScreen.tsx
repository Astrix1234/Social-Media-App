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
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { styles } from "./LoginScreen.styles";
import { useFormik } from "formik";
import { validationSchema } from "./validationSchema";
import { RootStackParamList } from "../../components/AppNavigator";
import { StackNavigationProp } from "@react-navigation/stack";

type registerScreenProp = StackNavigationProp<RootStackParamList, "Register">;

export const LoginScreen = () => {
  const navigation = useNavigation<registerScreenProp>();

  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [passwordShown, setPasswordShown] = useState(false);

  const formik = useFormik({
    initialValues: {
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

  const handleLogin = () => {
    navigation.navigate("Home");
    console.log("Pressed");
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
              <Text style={styles.title}>Sing in</Text>
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
                  onPress={handleLogin}
                  disabled={!(formik.isValid && formik.dirty)}
                >
                  <Text style={styles.btnText}>Sign in</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.btnRegisterContainer}>
                <TouchableOpacity
                  onPress={() => navigation.navigate("Register")}
                >
                  <Text style={styles.btnRegisterText}>
                    Don't have an account? Register now
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
