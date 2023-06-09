import { Controller, useForm } from "react-hook-form";
import styles from "../../../styles/edit.module.scss";
import { Loading } from "../../../components/Loading/Loading";
import { useEffect, useState } from "react";
import Router from "next/router";
import { toast } from "react-toastify";
import { Api } from "../../../providers/Api/api";
const FormData = require("form-data");

const EditForm = (props) => {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
  } = useForm();

  const user = JSON.parse(localStorage.getItem("userAuthentication"));

  useEffect(() => {
    if (props.profile) {
      setValue("name", props.profile.name);
      setValue("bio", props.profile.bio);
      setValue("phone", props.profile.phone);
      setValue("email", props.profile.email);
    }
  }, [props.profile]);

  const handleEdit = async (data) => {
    if (!user) return;
    try {
      const formData = new FormData();
      formData.append(
        "file",
        props.avatarImage?.length > 0 &&
          formData.append("file", props.avatarImage[0])
      );
      formData.append("name", data.name);
      formData.append("bio", data.bio);
      formData.append("phone", data.phone);
      formData.append("email", data.email);
      formData.append("password", data.password);

      await Api.put(`/api/users/${user._id}`, formData, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("User edited successfully!");
      Router.push("/profile");
      setLoading(false);
    } catch (err) {
      setLoading(false);
      toast.error("Error editing user!");
    }
  };

  const EditOptions = {
    name: { required: "Name is required" },
    phone: {
      required: "Phone is required",
      valueAsNumber: true,
    },
    email: { required: "Email is required" },
    password: {
      required: "Password is required",
      minLength: {
        value: 8,
        message: "Password must have at least 8 characters",
      },
    },
  };

  const formatPhone = (phone) => {
    const clearNumber = phone?.replace(/\D/g, "");
    return clearNumber?.replace(/^(\d{2})(\d{5})(\d{4}).*/, "($1) $2-$3");
  };

  return (
    <form onSubmit={handleSubmit(handleEdit)} encType="multipart/form-data">
      <div className={styles.info}>
        <p>Nome</p>
        <input
          type="text"
          name="name"
          defaultValue={props.profile?.name ?? ""}
          placeholder="Enter your name..."
          {...register("name", EditOptions.name)}
        />

        <p style={{ color: "red", fontSize: "1.6rem" }}>
          {errors?.name && errors.name.message}
        </p>
      </div>

      <div className={styles.info}>
        <p>Bio</p>
        <textarea
          placeholder="Enter your bio..."
          className={styles.bioInput}
          {...register("bio", EditOptions.bio)}
        />
      </div>

      <div className={styles.info}>
        <Controller
          control={control}
          defaultValue=""
          {...register("phone", { required: "Phone is required" })}
          render={({ field: { onChange, value } }) => {
            const newValue = value?.replace(/\D/g, "");
            return (
              <input
                type="phone"
                name="phone"
                placeholder="Enter your phone..."
                onChange={onChange}
                value={formatPhone(newValue)}
              />
            );
          }}
        />

        <p style={{ color: "red", fontSize: "1.6rem" }}>
          {errors?.phone && errors.phone.message}
        </p>
      </div>

      <div className={styles.info}>
        <p>Email</p>
        <input
          type="email"
          name="email"
          placeholder="Enter your email..."
          {...register("email", EditOptions.email)}
        />

        <p style={{ color: "red", fontSize: "1.6rem" }}>
          {errors?.email && errors.email.message}
        </p>
      </div>

      <div className={styles.info}>
        <p>Password</p>
        <input
          type="password"
          name="password"
          placeholder="Enter your password..."
          {...register("password", EditOptions.password)}
        />

        <p style={{ color: "red", fontSize: "1.6rem" }}>
          {errors?.password && errors.password.message}
        </p>
      </div>

      <div className={styles.info}>
        <button>{loading ? <Loading /> : "Save"}</button>
      </div>
    </form>
  );
};

export default EditForm;
