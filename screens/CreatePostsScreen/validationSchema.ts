import * as Yup from "yup";

export const validationSchema = Yup.object({
  photo: Yup.string().required("Required!"),
  title: Yup.string().required("Required!"),
  location: Yup.string().required("Required!"),
});
