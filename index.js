import express from "express"
const PORT=4000;
const app=express();
app.use(express.json());

const room={
    NumberofSeatsavailable:100,
    Amenities_in_room:"A/C or Non-Ac, Attached Bathroom, TV, Dining Facility",
    Price_1_hour:1000,
};

const data=[
    {
        RoomName:"Deluxe",
        Room_Id:101,
        Booked_status:"Booked",
        Customer_Name:"Rajesh",
        Booked_Date:"25/07/2023",
        Entry_Time:"11.00 AM",
        Exit_Time:"8:00 PM"
    },
    {
        RoomName:"Deluxe",
        Room_Id:102,
        Booked_status:"Booked",
        Customer_Name:"Ram",
        Booked_Date:"25/07/2023",
        Entry_Time:"10.00 AM",
        Exit_Time:"10:00 PM"
    },
    {
        RoomName:"Deluxe",
        Room_Id:103,
        Booked_status:"Booked",
        Customer_Name:"Amit",
        Booked_Date:"25/07/2023",
        Entry_Time:"9.00 AM",
        Exit_Time:"8:00 PM"
    },
    {
      RoomName:"Non-Deluxe",
      Room_Id:201,
      Booked_status:"Booked",
      Customer_Name:"Sam",
      Booked_Date:"25/07/2023",
      Entry_Time:"10.00 AM",
      Exit_Time:"7:00 PM"
  },
  {
    RoomName:"Non-Deluxe",
    Room_Id:202,
    Booked_status:"Booked",
    Customer_Name:"Vaibhav",
    Booked_Date:"25/07/2023",
    Entry_Time:"8.00 AM",
    Exit_Time:"8:00 PM"
  },
  {
  RoomName:"Non-Deluxe",
  Room_Id:203,
  Booked_status:"Booked",
  Customer_Name:"Abhi",
  Booked_Date:"25/07/2023",
  Entry_Time:"7.00 AM",
  Exit_Time:"5:00 PM"
  },
    

]

app.get("/",function(request,response){
  response.send('Welcome to Hall Booking App')
})


//Getting all rooms and booking status
app.get("/roomData",function(request,response){
  request.send(data);
})

//Room details
app.get("/rooms", function(request,response){
  response.send(room);
})

//Booking Room (Booking date -> Not Match)
app.get("/booked-details", function(request,response){
  const obj=data.map(
    ({Room_Id,Customer_Name,Booked_Date,Entry_Time,Exit_Time})=>{
      const cd={
        Room_Id:Room_Id,
        Customer_Name:Customer_Name,
        Booked_Date:Booked_Date,
        Entry_Time:Entry_Time,
        Exit_Time:Exit_Time,
      }
      return cd;
    }
  )
})

//Check Availability 

app.post("/to-book-hall", express.json(), function(request,response){
  let count=0;
  const newData=request.body;
  data.filter(({Booked_Date,Entry_Time,Exit_Time})=>{
    if(
      Booked_Date === newData.Booked_Date &&
      Entry_Time === newData.Entry_Time && 
      Exit_Time === newData.Exit_Time
    ){
      count++;
    }
  })
  if(count==0) {
    data.push(newData);
    response.send("Data Added Successfully");
  }else{
    response.send('Sorry! There is no available Room on this particular Date and time');
  }
  console.log(newData)
  console.log(count)
})


