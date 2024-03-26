
let UsersApi = "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"


export const Users =  async () =>{
    try{
        let UsersData = await fetch(UsersApi)
        let fetched = await UsersData.json()
        return fetched
    }
    catch(err){
        console.log(err)
    }
  
}

Users()