export const login = (username:string,password:string)=>{

 if(username==="admin" && password==="12345"){

   const token = {
     value:"fake-jwt-token",
     expiry:Date.now()+60000
   }

   localStorage.setItem(
     "token",
     JSON.stringify(token)
   )

   return true;
 }

 return false;
}


export const logout=()=>{
 localStorage.removeItem("token");
}


export const isAuthenticated=()=>{

 const token = localStorage.getItem("token");

 if(!token)
    return false;


 const data=JSON.parse(token);


 if(Date.now()>data.expiry){

    // silent refresh

    localStorage.setItem(
      "token",
      JSON.stringify({
        value:"new-token",
        expiry:Date.now()+60000
      })
    )

 }

 return true;

}