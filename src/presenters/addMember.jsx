import { useForm ,Controller } from "react-hook-form";
import { ErrorMessage } from '@hookform/error-message';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
import { useState, useEffect} from "react";
import { checkEmail , checkPhoneNumber,checkPersonalNumber, serviceOptions, titleOptions} from "../utilities.js";
import { addDocoment } from "../firebaseModel.js";
import { useQueryClient, useMutation } from "react-query";
import { useNavigate } from "react-router-dom";

export default function AddMembers() {

  const { register, formState: { errors }, handleSubmit, control,watch} = useForm({
    criteriaMode: "all",
  });

  const datawatched = watch();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const mutationAdd =useMutation (
    data => addDocoment("STMinaKOUFData", data ),{
      onSuccess: () => {
        queryClient.invalidateQueries("allMembers");
        navigate('/allMembers', { replace: true });      }
    }
  )
  const onSubmit = (data) => {
  mutationAdd.mutate(data)
  }

  useEffect(() => {
    console.log(datawatched)
  },[datawatched]);


  const renderCheckboxes = (checkbox) => {

    return (
      <label><br/>
        <input type="checkbox" {...register("Service")} value={checkbox} defaultChecked={false}/>
        {checkbox}
      </label> 
    );
  };

  function renderTitleOptions(option){
      return(
          <option value={option}>{option}</option>
      )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>

      <input
        {...register("FirstName", {
          required: "First name is required.",
          pattern: {
            value: /^[a-zA-Z]+$/,
            message: "This input is letters only."
          },
          maxLength: {
            value: 12,
            message: "This input exceed maxLength."
          }
        })}
        placeholder="First Name" 
      /> <br/>

      <ErrorMessage errors={errors} name="FirstName">
        {({ messages }) => {
          console.log(messages);
          return (
            messages &&
            Object.entries(messages).map(([type, message]) => (
              <div key={type}>{message}</div>
            ))
          );
        }}
      </ErrorMessage><br/>

      <input
        {...register("LastName", {
          required: "Last name is required.",
          pattern: {
            value: /^[a-zA-Z]+$/,
            message: "This input is letters only."
          },
          maxLength: {
            value: 12,
            message: "This input exceed maxLength."
          }
        })}
        placeholder="Last Name" 
      /><br/>

      <ErrorMessage errors={errors} name="LastName">
        {({ messages }) => {
          console.log(messages);
          return (
            messages &&
            Object.entries(messages).map(([type, message]) => (
              <div key={type}>{message}</div>
            ))
          );
        }}
      </ErrorMessage><br/>

      <Controller
            control={control}
              name="PhoneNumber"
              rules={{
                required: "Phone number is required",
                validate: (value) => checkPhoneNumber(value) || "Invalid number"
              }}
              render={({ field: { onChange, value } }) => (
                 <PhoneInput
                className="phone-input"
                  value={value}
                  onChange={onChange}
                  defaultCountry="se"
                   placeholder="Enter phone number"
                   required
              />
              )}
          />
        
        <ErrorMessage errors={errors} name="PhoneNumber">
          {({ messages }) => {
          console.log(messages);
          return (
            messages &&
            Object.entries(messages).map(([type, message]) => (
              <div key={type}>{message}</div>
            ))
          );
        }}
      </ErrorMessage><br/>

 
        <input placeholder="YYYYMMDD-XXXX" 
        {...register("PersonalNumber", {
          required: "personalnumber is required.",
          validate: (value) => {
          let returnedObject= checkPersonalNumber(value)
          if(returnedObject.boolean == false){
              return returnedObject.message;
          }
          return true;
          },
        })}
        /><br/>
        
      <ErrorMessage errors={errors} name="PersonalNumber">
        {({ messages }) => {
          console.log(messages);
          return (
            messages &&
            Object.entries(messages).map(([type, message]) => (
              <div key={type}>{message}</div>
            ))
          );
        }}
      </ErrorMessage><br/>

      <input placeholder="Street name" 
        {...register("StreetName", {
          required: "street name is required." ,
        })}
        /><br/>
        
      <ErrorMessage errors={errors} name="StreetName">
        {({ messages }) => {
          console.log(messages);
          return (
            messages &&
            Object.entries(messages).map(([type, message]) => (
              <div key={type}>{message}</div>
            ))
          );
        }}
      </ErrorMessage><br/>

      <input placeholder="post number" 
        {...register("PostNumber", {
          required: "post number is required." ,
          pattern: {
            value: /\d{5}/,
            message: "invalid post number"
          },
        })}
        /><br/>
        
      <ErrorMessage errors={errors} name="PostNumber">
        {({ messages }) => {
          console.log(messages);
          return (
            messages &&
            Object.entries(messages).map(([type, message]) => (
              <div key={type}>{message}</div>
            ))
          );
        }}
      </ErrorMessage><br/>

      <input placeholder="City" 
        {...register("city", {
          required: "city is required." ,
        })}
        /><br/>
        
      <ErrorMessage errors={errors} name="City">
        {({ messages }) => {
          console.log(messages);
          return (
            messages &&
            Object.entries(messages).map(([type, message]) => (
              <div key={type}>{message}</div>
            ))
          );
        }}
      </ErrorMessage><br/>

      <input placeholder="Email" 
        {...register("Email", {
          required: "Email is required." ,
          validate: (value) => {
          if(checkEmail(value) == true || value == ""){
              return true;
          }
          return "invalid email";
          },
        })}
        /><br/>
        
      <ErrorMessage errors={errors} name="Email">
        {({ messages }) => {
          console.log(messages);
          return (
            messages &&
            Object.entries(messages).map(([type, message]) => (
              <div key={type}>{message}</div>
            ))
          );
        }}
      </ErrorMessage><br/>



      <select {...register("Title", {required: 'title is required'})}>
                 <option value="">Select an option</option>
                 {titleOptions.map(renderTitleOptions)}
      </select><br/>

      <ErrorMessage errors={errors} name="Title">
          {({ messages }) => {
          console.log(messages);
          return (
            messages &&
            Object.entries(messages).map(([type, message]) => (
              <div key={type}>{message}</div>
            ))
          );
        }}
      </ErrorMessage><br/>

      {serviceOptions.map(renderCheckboxes)}<br/>

      <input type="submit" />
    </form>
  );
}

//         <PhoneInput
//         country={"se"}
//         enableSearch={true}
//         value={phone}
//         onChange={(phone, country) => handlePhoneChange(phone, country)}
//         inputStyle={inputStyle}
//         required={true}
//       />

//     let inputStyle = {
//         borderColor: isValidPhoneNumber ? "green" : "red",
//       };