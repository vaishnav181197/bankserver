//importing jwt package
const jwt=require("jsonwebtoken")

accounts = {
  1000: { account_no: 1000, name: "jaseel", phone: 9876543210, balance: 12000000, password: "jaseel123", transaction: [] },
  1001: { account_no: 1001, name: "shani", phone: 9876543211, balance: 22000000, password: "shani123", transaction: [] },
  1002: { account_no: 1002, name: "fijun", phone: 9876543212, balance: 32000000, password: "fijun123", transaction: [] },
  1003: { account_no: 1003, name: "sahal", phone: 9876543213, balance: 42000000, password: "sahal123", transaction: [] },
}



const register = (acno, uname, phone, pswd) => {

  if (acno in accounts) {
    return {
      status: false,
      message: "Account Already exists!....please login!",
      statusCode: 404
    }
  }
  else {
    accounts[acno] = { account_no: acno, name: uname, phone: phone, balance: 0, password: pswd, transaction: [] }
    console.log(accounts)
    return {
      status: true,
      message: "Registration Completed!!",
      statusCode: 201

    }
  }
}

const login = (acno, pswd) => {
  if (acno in accounts) {
    if (accounts[acno].password == pswd) {
      currentUser = accounts[acno].name
      currentAcno = acno
      token=jwt.sign(
        //acno of current user
        {currentAcno:acno},"secretsuperkey1234"
      )
      return {
        status: true,
        message: "Login Successfull",
        statusCode: 200,
        currentUser,
        token
      }
    }
    else {
      return {
        status: false,
        message: "Invalid Password",
        statusCode: 400
      }
    }
  }
  else {
    return {
      status: false,
      message: "Invalid Account Number",
      statusCode: 400
    }
  }
}

const deposite = (acc, pswd, amnt) => {
  if (acc in accounts) {
    if (accounts[acc].password == pswd) {
      accounts[acc].balance += parseInt(amnt)
      let details = { "Type": "CREDIT", "Amount": parseInt(amnt), "Balance": accounts[acc].balance }
      accounts[acc].transaction.push(details)
      return {
        status: true,
        message: "Amount deposited to your account.Balance is:" + accounts[acc].balance,
        statusCode: 200
      }
    }
    else {
      return {
        status: false,
        message: "Invalid Password",
        statusCode: 400
      }
    }

  }

  else {
    return {
      status: false,
      message: "invalid Account Number",
      statusCode: 400
    }
  }
}

const withdraw = (acc, pswd, amnt) => {
  if (acc in accounts) {
    if (accounts[acc].password == pswd) {
      if (accounts[acc].balance < amnt) {
        return {
          status: false,
          message: "insufficient Balance",
          statusCode: 422
        }
      }
      else {
        accounts[acc].balance -= parseInt(amnt)
        // let details={"Type":"DEBIT","Amount":parseInt(amnt)}
        accounts[acc].transaction.push({ "Type": "DEBIT", "Amount": parseInt(amnt) })
        return {
          status:true,
          message:"withdraw successfull.Balance is:"+accounts[acc].balance,
          statusCode:200
        }
      }

    }
    else {
      return {
        status:false,
        message:"Invalid Password",
        statusCode:422
      }
    }

  }
  else {
    
    return {
      status:false,
      message:"Invalid Ac.No",
      statusCode:422
    }
  }
}

const getTransaction=(acc)=>{
  if(acc in accounts){
    return {
      status:true,
      message:"success",
      data:accounts[acc].transaction,
      statusCode:200
    }
  }
  else{
    return {
      status:false,
      message:"invalid acc",
      statusCode:422
    }
  }
}



module.exports = {
  register,
  login,
  deposite,
  withdraw,
  getTransaction
}