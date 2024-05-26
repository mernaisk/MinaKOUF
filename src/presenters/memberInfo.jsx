
import { useQuery,useQueryClient,useMutation} from "react-query";
import { getOneDocInCollection,updateDocument,deleteDocument} from "../firebaseModel.js";
import { useForm ,Controller } from "react-hook-form";
import { ErrorMessage } from '@hookform/error-message';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
import { useState, useEffect} from "react";
import {serviceOptions,titleOptions, checkEmail , checkPhoneNumber,checkPersonalNumber} from "../utilities.js";
import { useLocation,useNavigate} from "react-router-dom";

export default function MemberInfo(){
  const location = useLocation();
  const navigate = useNavigate();
  const memberID  = location.state;
  console.log(memberID)

    const [isEditTriggered, setEditTrigered] = useState(false)
    // const [mystylingclassname, setmystylingclassname] = useState("styleoption1")

    const { register, formState: { errors }, handleSubmit, control,watch,setValue} = useForm({
        criteriaMode: "all",
      });
    // console.log(props.model)

    const {data:memberInfo,isLoading}= useQuery({
        queryFn: () => getOneDocInCollection("STMinaKOUFData", memberID),
        queryKey:"memberInfo"
    });

    const queryClient = useQueryClient();

    const mutationUpdate = useMutation(
      data => updateDocument("STMinaKOUFData", memberID, data),
      {
        onSuccess: () => {
          queryClient.invalidateQueries("allMembers");
          navigate('/allMembers');
        },
      }
    );
    const mutationDelete = useMutation(
      ID => deleteDocument("STMinaKOUFData", ID),
      {
        onSuccess: () => {
          queryClient.invalidateQueries("allMembers");
          navigate('/allMembers');
        }
      }
    )

    function handleDeleteClick(){
      mutationDelete.mutate(memberID);
    }
  
    function onSubmit(data){
      console.log(data)
      mutationUpdate.mutate(data);
    };

    const renderCheckboxes = (checkbox) => {

        return (
          <label><br/>
            <input  disabled={!isEditTriggered} type="checkbox" {...register("Service")} value={checkbox} />
            {checkbox}
          </label> 
        );
      };
    
      function renderTitleOptions(option){
          return(
              <option value={option}>{option}</option>
          )
      }

    // useEffect(() => {
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
      // }, [memberInfo, setValue]);

      if (isLoading) {
        return <div>loading...</div>;
    }

    // console.log(isEditTriggered)
    function handleEditClick(){
      setEditTrigered(!isEditTriggered)
      // if(isEditTriggered){
      //   setmystylingclassname("styleoption2")
      // }
    }

    return(
        <div>
          {/* <Link to="/KOUF"> KOUF </Link> */}
        {isEditTriggered ? (
        <button onClick={handleDeleteClick}>Delete</button>
        ) : (
        <button onClick={handleEditClick}>Edit</button>
      )}
              <br/>

        <form onSubmit={handleSubmit(onSubmit)}>

        <input
        {...register("FirstName", {
          required: "First name is required.",
          pattern: {
            value: /^[a-zA-Z]+$/, //space and streck
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
        // className= {mystylingclassname}
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
            message: "invalid post number. It should be 5 digits"
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
      {/* inget option */}
      <button type="submit">Save</button>
    </form>


        </div>
    )
}