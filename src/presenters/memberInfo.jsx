
import { useQuery } from "react-query";
import { getOneDocInCollection,updateDocument,deleteDocument} from "../firebaseModel.js";
import { useForm ,Controller } from "react-hook-form";
import { ErrorMessage } from '@hookform/error-message';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
import { useState, useEffect} from "react";
import { checkEmail , checkPhoneNumber,checkPersonalNumber} from "../utilities.js";

export default function MemberInfo(props){
    const [isEditTriggered, setEditTrigered] = useState(false)

    const { register, formState: { errors }, handleSubmit, control,watch,setValue} = useForm({
        criteriaMode: "all",
      });
    console.log(props.model)

    const {data:memberInfo,isLoading}= useQuery({
        queryFn: () => getOneDocInCollection("STMinaKOUFData", props.model.memberToEditID),
        queryKey:"memberInfo"
    });

    const onSubmit = (data) => {
        // console.log(data)
        updateDocument("STMinaKOUFData", props.model.memberToEditID , data );
        window.location=window.location.hash="#/allMembers";}

    const renderCheckboxes = (checkbox) => {

        return (
          <label><br/>
            <input  disabled={!isEditTriggered} type="checkbox" {...register("Service")} value={checkbox} defaultChecked={false}/>
            {checkbox}
          </label> 
        );
      };
    
      function renderTitleOptions(option){
          return(
              <option value={option}>{option}</option>
          )
      }

    useEffect(() => {
        if (memberInfo) {
          setValue("FirstName", memberInfo.FirstName);
          setValue("LastName", memberInfo.LastName);
          setValue("PhoneNumber", memberInfo.PhoneNumber);
          setValue("PersonalNumber", memberInfo.PersonalNumber);
          setValue("StreetName", memberInfo.StreetName);
          setValue("PostNumber", memberInfo.PostNumber);
          setValue("city", memberInfo.city);
          setValue("Email", memberInfo.Email);
          setValue("Title", memberInfo.Title);
          setValue("Service", memberInfo.Service);
        }
      }, [memberInfo, setValue]);

      if (isLoading) {
        return <div>loading...</div>;
    }
    function handleDeleteClick(){
        deleteDocument("STMinaKOUFData", props.model.memberToEditID );
        window.location=window.location.hash="#/allMembers";
    }

    console.log(isEditTriggered)

    return(
        <div>
        {isEditTriggered ? (
        <button onClick={handleDeleteClick}>Delete</button>
        ) : (
        <button onClick={() => setEditTrigered(!isEditTriggered)}>Edit</button>
      )}
              <br/>

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
        disabled={!isEditTriggered}
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
        disabled={!isEditTriggered}
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
                   disabled={!isEditTriggered}
              
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
        disabled={!isEditTriggered}
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
              disabled={!isEditTriggered}
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
        disabled={!isEditTriggered}
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
        disabled={!isEditTriggered}
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
        disabled={!isEditTriggered}
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

      <select  disabled={!isEditTriggered} {...register("Title", {required: 'title is required'})}>
                 <option value="">Select an option</option>
                 {props.model.titleOptions.map(renderTitleOptions)}
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

      {props.model.serviceOptions.map(renderCheckboxes)}<br/>
      <button type="submit">Save</button>
    </form>


        </div>
    )
}