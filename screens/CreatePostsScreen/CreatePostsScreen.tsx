import React, { useLayoutEffect, useState } from "react";
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
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { styles } from "./CreatePostsScreen.styles";
import { Ionicons } from "@expo/vector-icons";
import { useFormik } from "formik";
import { validationSchema } from "./validationSchema";
import { FontAwesome6, MaterialIcons } from "@expo/vector-icons";

export const CreatePostsScreen = () => {
  const navigation = useNavigation();
  const [focusedField, setFocusedField] = useState<string | null>(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons
            name="arrow-back"
            size={30}
            color="#BDBDBD"
            style={{ marginLeft: 16 }}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const formik = useFormik({
    initialValues: {
      title: "",
      location: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      console.log(values);
    },
  });

  const handleFocus = (name: string) => {
    setFocusedField(name);
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
              <View style={styles.imageContainer}>
                <TouchableOpacity
                  style={styles.camera}
                  onPress={() => console.log("press")}
                >
                  <MaterialIcons name="photo-camera" size={30} color="white" />
                </TouchableOpacity>
              </View>
              <TouchableOpacity>
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
                />
                {formik.touched.location && formik.errors.location && (
                  <Text style={styles.errorText}>{formik.errors.location}</Text>
                )}
                <TouchableOpacity
                  style={styles.btnLocation}
                  onPress={() => console.log("press")}
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
            </View>
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
