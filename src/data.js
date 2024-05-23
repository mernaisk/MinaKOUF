import React from "react";


export default {

    member: {
        FirstName: null,
        LastName: null,
        PersonalNumber: null,
        StreetName:null,
        PostNumber: null,
        City: null,
        PhoneNumber: null,
        LastAttendenceDate: null,
        Title: null,
        Service:null,
        Email: null
    },

    titleOptions: [
        "Ungdom",
        "Teaternansvarig",
        "Aktivitetsansvarig",
        "Ordförande ",
        "Mediaansvarig",
        "Visordförande",
        "Utbildningsansvaig",
        "Kommunansvarig",
        "Bildaansvarig",
        "Sekreterare ",
        "köransvarig"],

    serviceOptions: [
        "Teatern",
        "Kören",
        "Aktiviteter",
        "Eftekad",
        "Utbildning",
    ],


    setFirstName(firstName){
        this.member.FirstName = firstName;
    },

    setLastName(lastName){
        this.member.LastName = lastName;
    },

    setPersonalNumber(personalNumber){
        this.member.PersonalNumber = personalNumber;
    },

    setStreetName(streetName){
        this.member.StreetName = streetName;
    },

    setPostNumber(postNumber){
        this.member.PostNumber = postNumber;
    },

    setCity(city){
        this.member.City = city;
    },

    setPhoneNumber(phoneNumber){
        this.member.PhoneNumber = phoneNumber;
    },

    setLastAttendenceDate(lastAttendenceDate){
        this.member.LastAttendenceDate = lastAttendenceDate;
    },

    setTitle(title) {
        this.member.Title = title; // Push single title to the array
    },

    setService(service){
        this.member.Service = service; // Push single title to the array
    },

    removeService(serviceToRemove) {
        this.member.Service = this.member.Service.filter(title => title !== serviceToRemove);
    },

    setEmail(email){
        this.member.Email = email;
    },






    memberToEditID:null,

    setMemberToEditID(id){
        this.memberToEditID=id;
    },
    






    youthMessage:{
        type:null,
        option: null,
        text: null,
        date:null,
    },

    setOption(option){
        this.youthMessage.option = option;
    },

    setText(text){
        this.youthMessage.text = text;
    },
    setDate(){
        var showdate = new Date();
        this.youthMessage.date = showdate.getDate() + '/' + showdate.getMonth() + '/' + showdate.getFullYear();
    },
    setType(type){
        this.youthMessage.type =type;
    },

    submit(type){
        const newSubmit = {
            type: type,
            data: this.date,
            text: this.text,
            option: this.option,
        };
        
        this.youthMessages.push(newSubmit);
    }

}
